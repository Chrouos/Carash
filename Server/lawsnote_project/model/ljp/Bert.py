import torch
import torch.nn as nn
import torch.nn.functional as F
import numpy as np
from model.encoder.BertEncoder import BertEncoder
from model.encoder.LoRAEncoder import LoRAEncoder
from model.loss import MultiLabelSoftmaxLoss, log_square_loss, RMSE_loss
from model.ljp.Predictor import LJPPredictor
from tools.accuracy_tool import multi_label_accuracy, log_distance_accuracy_function
from pytorch_pretrained_bert.tokenization import BertTokenizer


class LJPBert(nn.Module):
    def __init__(self, config, gpu_list, *args, **params):
        super(LJPBert, self).__init__()

        # self.bert = BertEncoder(config, gpu_list, *args, **params)
        self.bert = LoRAEncoder(config, gpu_list, *args, **params)
        self.fc = LJPPredictor(config, gpu_list, *args, **params)

        self.criterion = {
            # "charge": MultiLabelSoftmaxLoss(config, 202),
            # "article": MultiLabelSoftmaxLoss(config, 183),
            # "money": RMSE_loss
            "money": log_square_loss
        }
        self.accuracy_function = {
            # "charge": multi_label_accuracy,
            # "article": multi_label_accuracy,
            "money": log_distance_accuracy_function,
        }

    def init_multi_gpu(self, device, config, *args, **params):
        self.bert = nn.DataParallel(self.bert, device_ids=device)
        self.fc = nn.DataParallel(self.fc, device_ids=device)

    def forward(self, data, config, gpu_list, acc_result, mode):
        x = data['text']
        y = self.bert(x)
        result = self.fc(y)
        print("label: ", data["money"])
        print("predict: ", result["money"])

        loss = 0
        for name in ["money"]:
            loss += self.criterion[name](result[name], data[name])

        if acc_result is None:
            acc_result = {"money": None}

        for name in ["money"]:
            acc_result[name] = self.accuracy_function[name](result[name], data[name], config, acc_result[name])

        return {"loss": loss, "acc_result": acc_result}

class LJPBert_test(nn.Module):
    def __init__(self, config, gpu_list, *args, **params):
        super(LJPBert_test, self).__init__()

        # self.bert = BertEncoder(config, gpu_list, *args, **params)
        self.bert = LoRAEncoder(config, gpu_list, *args, **params)
        self.fc = LJPPredictor(config, gpu_list, *args, **params)

        self.criterion = {
            # "charge": MultiLabelSoftmaxLoss(config, 202),
            # "article": MultiLabelSoftmaxLoss(config, 183),
            # "money": RMSE_loss
            "money": log_square_loss
        }
        self.accuracy_function = {
            # "charge": multi_label_accuracy,
            # "article": multi_label_accuracy,
            "money": log_distance_accuracy_function,
        }

    def init_multi_gpu(self, device, config, *args, **params):
        self.bert = nn.DataParallel(self.bert, device_ids=device)
        self.fc = nn.DataParallel(self.fc, device_ids=device)

    def forward(self, data, config, gpu_list, acc_result, mode):
        x = data['text']
        y = self.bert(x)
        result = self.fc(y)
        # print("label: ", data["money"])
        # print("predict: ", result["money"])
        
        return result["money"].detach().to('cpu').numpy()