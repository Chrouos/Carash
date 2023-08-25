from model.ljp.Bert import LJPBert, LJPBert_test
# from model.ljp.CNN import SCMCNN
# from model.ljp.LoRA import CLLoRA
# from model.ljp.CNN import LJPCNN
# from model.ljp.LSTM import LSTM

model_list = {
    "LJPBert": LJPBert,
    "LJPBert_test": LJPBert_test
    # "SCMCNN": SCMCNN,
    # "CLLoRA": CLLoRA
    # "LJPCNN": LJPCNN,
    # "LJPLSTM": LSTM,
}


def get_model(model_name):
    if model_name in model_list.keys():
        return model_list[model_name]
    else:
        raise NotImplementedError
