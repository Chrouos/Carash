import torch.nn as nn
from transformers import AutoModel
from peft import (
    get_peft_model,
    LoraConfig,
)



class LoRAEncoder(nn.Module):
    def __init__(self, config, gpu_list, *args, **params):
        super(LoRAEncoder, self).__init__()
        
        # print(config.get("model", "LoRA_path"))
        model = AutoModel.from_pretrained(config.get("model", "bert_path"), return_dict=True)
        print(model)
        peft_config = LoraConfig(inference_mode=False, r=8, lora_alpha=16, lora_dropout=0.1)
        print(peft_config)
        self.LoRa = get_peft_model(model, peft_config)
        # model.print_trainable_parameters()
        # model

    def forward(self, x):
        y = self.LoRa(x)
        return y.pooler_output