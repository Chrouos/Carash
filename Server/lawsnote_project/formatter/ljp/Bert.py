import json
import torch
import os
import numpy as np
import random
# from pytorch_pretrained_bert.tokenization import BertTokenizer

from formatter.Basic import BasicFormatter
from transformers import AutoTokenizer

class BertLJP(BasicFormatter):
    def __init__(self, config, mode, *args, **params):
        super().__init__(config, mode, *args, **params)

        # self.tokenizer = BertTokenizer.from_pretrained(config.get("model", "bert_path"))
        self.tokenizer = AutoTokenizer.from_pretrained(config.get("model", "bert_path"))
        # self.tokenizer = AutoTokenizer.from_pretrained(config.get("model", "LoRA_path"))
        self.max_len = config.getint("data", "max_seq_length")
        self.mode = mode

        # charge = open(config.get("data", "charge_path"), "r", encoding="utf8")
        # self.charge2id = {}

        # for line in charge:
        #     self.charge2id[line.replace("\r", "").replace("\n", "")] = len(self.charge2id)

        # article = open(config.get("data", "article_path"), "r", encoding="utf8")
        # self.article2id = {}

        # for line in article:
        #     self.article2id[int(line.replace("\r", "").replace("\n", ""))] = len(self.article2id)

    def process(self, data, config, mode, *args, **params):
        input = []
        # charge = []
        # article = []
        money = []

        for temp in data:
            text = temp["happened"]

            text = self.tokenizer.tokenize(text)
            text = ["[CLS]"] + text + ["[SEP]"]
            while len(text) < self.max_len:
                text.append("[PAD]")
            text = text[0:self.max_len]
            input.append(self.tokenizer.convert_tokens_to_ids(text))

            # temp_charge = np.zeros(len(self.charge2id), dtype=np.int)
            # for name in temp["meta"]["accusation"]:
            #     # temp_charge[self.charge2id[name.replace("[", "").replace("]", "")]] = 1
            #     temp_charge[self.charge2id[name]] = 1
            # charge.append(temp_charge.tolist())

            # temp_article = np.zeros(len(self.article2id), dtype=np.int)
            # for name in temp["meta"]["relevant_articles"]:
            #     temp_article[self.article2id[int(name)]] = 1
            # article.append(temp_article.tolist())

            # if temp["meta"]["term_of_imprisonment"]["life_imprisonment"]:
            #     temp_term = 350
            # elif temp["meta"]["term_of_imprisonment"]["death_penalty"]:
            #     temp_term = 400
            # else:
            #     temp_term = int(temp["meta"]["term_of_imprisonment"]["imprisonment"])
            
            temp_money = int(temp["money"])
            money.append(temp_money)
            
            # print(text)
            # print(term)
            # print(abc)

        input = torch.LongTensor(input)
        # charge = torch.LongTensor(charge)
        # article = torch.LongTensor(article)
        money = torch.FloatTensor(money)

        return {'text': input, 'money': money}

