import json
import torch
import os
import numpy as np

from pytorch_pretrained_bert.tokenization import BertTokenizer

from formatter.Basic import BasicFormatter


class WordLJP(BasicFormatter):
    def __init__(self, config, mode, *args, **params):
        super().__init__(config, mode, *args, **params)

        self.tokenizer = json.load(open(config.get("data", "word2id"), "r", encoding="utf8"))
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

    def convert_tokens_to_ids(self, text):
        arr = []
        for a in range(0, len(text)):
            if text[a] in self.tokenizer.keys():
                arr.append(self.tokenizer[text[a]])
            else:
                arr.append(self.tokenizer["[UNK]"])
        return arr

    def process(self, data, config, mode, *args, **params):
        input = []
        charge = []
        article = []

        for temp in data:
            text = temp["happened"]
            # print(text)

            text_ids = self.convert_tokens_to_ids(text)
            while len(text_ids) < self.max_len:
                text_ids.append(self.tokenizer["[PAD]"])
            text_ids = text_ids[0:self.max_len]
            # print(text_ids)

            input.append(text_ids)

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
            temp_term = int(temp["money"])
            term.append(temp_term)
            
            print(text)
            print(temp_term)
            print(abc)

        input = torch.LongTensor(input)
        # charge = torch.LongTensor(charge)
        # article = torch.LongTensor(article)
        term = torch.FloatTensor(term)

        return {'text': input, 'charge': charge, 'article': article}
