export const accidentDetails: AccidentDetailsType = {
    "_id": "",                  
    "title": "",                
    "historyChatContent": [
        // {
        //     "character": "questioner",
        //     "value": "108年4月30日，大概早上十點多的時候，我騎重機在中山路附近行駛。有台轎車沒有遵守交通號誌，闖紅燈，撞到我害我倒地，左邊膝蓋開放性骨折還有很多擦傷。",
        //     "createTime": "2024-02-06T12:28:45.000Z"
        // },
        // {
        //     "character": "chatBot",
        //     "value": "請問你方行進方向的號誌是什麼顏色？",
        //     "createTime": "2024-02-06T12:28:45.000Z"
        // }
    ],   
    "incidentJson": {           
        "車禍發生事故": {
            "事故發生日期": "",
            "事故發生時間": "",
            "事故發生地點": "",
            "對方駕駛交通工具": "",
            "我方駕駛交通工具": "",
            "我方行駛道路": "",
            "事發經過": "",
            "我方行進方向的號誌": "",
            "當天天候": "",
            "道路狀況": "",
            "我方行車速度": "",
            "我方車輛損壞情形": "",
            "我方傷勢": "",
            "對方車輛損壞情形": "",
            "對方傷勢": "",
            "我方從哪裡出發": "",
            "我方出發目的地": "",
            "我方出發目的是什麼": ""
        },
        "車輛詳細狀況": {
            "是否有修車估價單": "",
            "車輛出廠年月": "",
            "修車費用": "",
            "零件費用": "",
            "材料費用": "",
            "工資費用": "",
            "板金費用": "",
            "塗裝費用": "",
            "烤漆費用": ""
        },
        "醫療詳細狀況": {
            "是否有醫療費用單": "",
            "醫療費用": "",
            "看護費用": "",
            "看護天數": "",
            "看護價格": ""
        },
        "其他費用賠償": {
            "交通費用": "",
            "財產損失": "",
            "營業損失": "",
            "工作損失": "",
            "精神賠償": ""
        }
    }
}


interface ChatContentType {
    value: string; 
    character: "questioner" | "chatBot";
    createTime: string;
}

interface AccidentDetailsType {
    _id: string;
    title: string;
    historyChatContent: ChatContentType[];
    incidentJson: {
        [key: string]: {
            [key: string]: string;
        };
    };
}

export type { AccidentDetailsType, ChatContentType };