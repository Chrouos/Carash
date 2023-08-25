import argparse
import os
import torch
import logging

from tools.init_tool import init_all_test
from config_parser import create_config
from tools.test_tool import First_Stage_Test#, First_Stage_Result
from reader.reader import init_formatter, init_test_dataset, init_valid_dataset
import numpy as np
import json

logger = logging.getLogger()
logger.setLevel(logging.DEBUG)
ch = logging.StreamHandler()
ch.setLevel(logging.DEBUG)
formatter = logging.Formatter('%(asctime)s - %(name)s - %(levelname)s - %(message)s')

ch.setFormatter(formatter)
logger.addHandler(ch)

# def Gen_BPG_Art2Charge(bpg_article2charge, article):
#     charge = []
#     for art in article:
#         charge += bpg_article2charge[art]
#         return list(set(charge))

# def Gen_Json_Data(source, destination, results, percentages, bpg, mapping):
#     for i, line in enumerate(source):
#         index1 = np.where(results[i] == 1)[0]
#         line = json.loads(line)
#         # print(line)
#         line["predict"] = {}
#         line["predict"]["articles"] = []
#         line["predict"]["percentages"] = []
#         line["predict"]["bpg_charge"] = []
#         # print(i)
#         # print(index1)
#         if len(index1) != 0:
#             for index in index1:
#                 # print(articles[index])
#                 # print(valid_percentages[i][index])
#                 line["predict"]["articles"] += [mapping[index]]
#                 line["predict"]["percentages"] += [round(percentages[i][index].item(), 3)]
#             bpg_charge = Gen_BPG_Art2Charge(bpg, line["predict"]["articles"])
#             line["predict"]["bpg_charge"] = bpg_charge
#         destination.write(json.dumps(line, ensure_ascii=False) + '\n')
#         destination.flush()
#     logger.info("Generate File!")

if __name__ == "__main__":
    parser = argparse.ArgumentParser()
    parser.add_argument('--config', '-c', help="specific config file", default="predict.config")#, required=True)
    parser.add_argument('--gpu', '-g', help="gpu id list", default="0")
    parser.add_argument('--checkpoint', default="model/ljp/Bert/29.pkl", help="checkpoint file path")
    parser.add_argument('--input', '-i', help="input of text")
    args = parser.parse_args()

    configFilePath = args.config

    use_gpu = True
    gpu_list = []
    if args.gpu is None:
        use_gpu = False
    else:
        use_gpu = True
        os.environ["CUDA_VISIBLE_DEVICES"] = args.gpu

        device_list = args.gpu.split(",")
        for a in range(0, len(device_list)):
            gpu_list.append(int(a))

    # os.system("clear")  # Unix
    os.system("cls")    # windows 


    config = create_config(configFilePath)

    cuda = torch.cuda.is_available()
    logger.info("CUDA available: %s" % str(cuda))
    if not cuda and len(gpu_list) > 0:
        logger.error("CUDA is not available but specific gpu id")
        raise NotImplementedError

    parameters = init_all_test(config, gpu_list, args.checkpoint, "test")
    # Initial dict
    # article_file = open(config.get("data", "article_path"), "r", encoding="utf8")
    # articles = []
    # for article in article_file:
    #     articles.append(article.strip())
    
    # bpg_article2charge_f = open('data/bpg_article2charge_CLAIM.json', "r", encoding="utf8")
    # bpg_article2charge = json.load(bpg_article2charge_f)
    
    # Initial Dataset
    logger.info("Begin to initialize dataset and formatter...")
    # init_formatter(config, ["valid"])
    test_dataset = init_test_dataset(config)
    
    results = First_Stage_Test(parameters, test_dataset, config, gpu_list)
    print(results)
    
    
    logger.info("Done!")