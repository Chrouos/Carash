import json

from .accuracy_tool import gen_micro_macro_result


def null_output_function(data, config, *args, **params):
    return ""


def basic_output_function(data, config, *args, **params):
    which = config.get("output", "output_value").replace(" ", "").split(",")
    temp = gen_micro_macro_result(data)
    result = {}
    for name in which:
        result[name] = temp[name]

    return json.dumps(result, sort_keys=True)


def ljp_output_function(data, config, *args, **params):
    temp = {}
    temp["charge"] = gen_micro_macro_result(data["charge"])
    temp["article"] = gen_micro_macro_result(data["article"])

    result = {}
    for name in ["charge", "article"]:
        result[name] = []
        for name_ in ["mip", "mir", "mif", "map", "mar", "maf"]:
            result[name].append(temp[name][name_])


    return json.dumps(result, sort_keys=True)

def QC_output_function(data, config, *args, **params):
    temp = {}
    temp["money"] = data["money"]
    
    result = {}
    result["money"] = data["money"][1] / data["money"][0]


    return json.dumps(result, sort_keys=True)