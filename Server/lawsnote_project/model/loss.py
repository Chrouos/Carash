import torch
import torch.nn as nn
import torch.nn.functional as F
from torch.autograd import Variable
import numpy as np


class MultiLabelSoftmaxLoss(nn.Module):
    def __init__(self, config, task_num=0):
        super(MultiLabelSoftmaxLoss, self).__init__()
        self.task_num = task_num
        self.criterion = []
        for a in range(0, self.task_num):
            try:
                ratio = config.getfloat("train", "loss_weight_%d" % a)
                self.criterion.append(
                    nn.CrossEntropyLoss(weight=torch.from_numpy(np.array([1.0, ratio], dtype=np.float32)).cuda()))
                # print_info("Task %d with weight %.3lf" % (task, ratio))
            except Exception as e:
                self.criterion.append(nn.CrossEntropyLoss())

    def forward(self, outputs, labels):
        loss = 0
        for a in range(0, len(outputs[0])):
            o = outputs[:, a, :].view(outputs.size()[0], -1)
            loss += self.criterion[a](o, labels[:, a])

        return loss


def multi_label_cross_entropy_loss(outputs, labels):
    labels = labels.float()
    temp = outputs
    res = - labels * torch.log(temp) - (1 - labels) * torch.log(1 - temp)
    res = torch.mean(torch.sum(res, dim=1))

    return res


def cross_entropy_loss(outputs, labels):
    criterion = nn.CrossEntropyLoss()
    return criterion(outputs, labels)


def log_square_loss(outputs, labels):
    # return torch.mean((torch.log(torch.clamp(outputs, 0, 450) + 1) - torch.log(torch.clamp(labels, 0, 450) + 1)) ** 2)
    return torch.mean((torch.log(outputs + 1) - torch.log(labels + 1)) ** 2)

def RMSE_loss(outputs, labels):
    # return torch.sqrt(nn.MSELoss(outputs, labels))
    return torch.sqrt(torch.mean((outputs-labels)**2))

class FocalLoss(nn.Module):
    def __init__(self, gamma=0, alpha=None, size_average=True):
        super(FocalLoss, self).__init__()
        self.gamma = gamma
        self.alpha = alpha
        self.size_average = size_average

    def forward(self, input, target):
        if input.dim() > 2:
            input = input.view(input.size(0), input.size(1), -1)  # N,C,H,W => N,C,H*W
            input = input.transpose(1, 2)  # N,C,H*W => N,H*W,C
            input = input.contiguous().view(-1, input.size(2))  # N,H*W,C => N*H*W,C
        target = target.view(-1, 1)

        logpt = F.log_softmax(input)
        logpt = logpt.gather(1, target)
        logpt = logpt.view(-1)
        pt = Variable(logpt.data.exp())

        if self.alpha is not None:
            if self.alpha.type() != input.data.type():
                self.alpha = self.alpha.type_as(input.data)
            at = self.alpha.gather(0, target.data.view(-1))
            logpt = logpt * Variable(at)

        loss = -1 * (1 - pt) ** self.gamma * logpt
        if self.size_average:
            return loss.mean()
        else:
            return loss.sum()

def euclidean_distance(x, y):
    """
    Compute Euclidean distance between two tensors.
    """
    return torch.pow(x - y, 2).sum(dim=1)

def compute_distance_matrix(anchor, positive, negative):
    """
    Compute distance matrix between anchor, positive, and negative samples.
    """
    distance_matrix = torch.zeros(anchor.size(0), 3)
    # print(distance_matrix)
    distance_matrix[:, 0] = euclidean_distance(anchor, anchor)
    # print(distance_matrix[:, 0])
    distance_matrix[:, 1] = euclidean_distance(anchor, positive)
    # print(distance_matrix[:, 1])
    distance_matrix[:, 2] = euclidean_distance(anchor, negative)
    # print(distance_matrix)
    return distance_matrix

def batch_all_triplet_loss(anchor, positive, negative, margin=1):
    """
    Compute triplet loss using the batch all strategy.
    """
    distance_matrix = compute_distance_matrix(anchor, positive, negative)
    # print(distance_matrix)
    # loss = torch.max(torch.tensor(0.0), distance_matrix[:, 0] - distance_matrix[:, 1] + margin)
    # print(distance_matrix[:, 0] - distance_matrix[:, 1])
    # print(torch.max(torch.tensor(0.0), distance_matrix[:, 0] - distance_matrix[:, 1] + margin))
    # loss += torch.max(torch.tensor(0.0), distance_matrix[:, 0] - distance_matrix[:, 2] + margin)
    # print(distance_matrix[:, 0] - distance_matrix[:, 2])
    loss = torch.max(torch.tensor(0.0), distance_matrix[:, 1] - distance_matrix[:, 2] + margin)
    # print(loss)
    return torch.mean(loss)

def batch_hard_triplet_loss(anchor, positive, negative, margin=0.2):
    """
    Compute triplet loss using the batch hard strategy.
    """
    distance_matrix = compute_distance_matrix(anchor, positive, negative)
    hard_negative = torch.argmax(distance_matrix[:, 2])
    loss = torch.max(torch.tensor(0.0), distance_matrix[:, 0] - distance_matrix[:, 1] + margin)
    loss += torch.max(torch.tensor(0.0), distance_matrix[:, 0][hard_negative] - distance_matrix[:, 2] + margin)
    return torch.mean(loss)