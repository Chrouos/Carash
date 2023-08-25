import torch
import torch.nn as nn
import torch.nn.functional as F


class LJPPredictor(nn.Module):
    def __init__(self, config, gpu_list, *args, **params):
        super(LJPPredictor, self).__init__()

        self.hidden_size = config.getint("model", "hidden_size")
        # self.authority_fc = nn.Linear(self.hidden_size, 6 * 2)
        # self.evaluation_fc = nn.Linear(self.hidden_size, 3 * 2)
        self.hidden = nn.Linear(self.hidden_size, self.hidden_size)
        self.hidden_2 = nn.Linear(self.hidden_size, self.hidden_size)
        self.money_fc = nn.Linear(self.hidden_size, 1)

    def init_multi_gpu(self, device, config, *args, **params):
        pass

    def forward(self, h):
        # authority = self.authority_fc(h)
        # evaluation = self.evaluation_fc(h)
        money = self.hidden(h)
        money = self.hidden_2(money)
        money = self.money_fc(money)

        batch = h.size()[0]
        # authority = authority.view(batch, -1, 2)
        # evaluation = evaluation.view(batch, -1, 2)
        money = money.view(batch)

        return {"money": money}
