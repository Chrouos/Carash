const { Configuration, OpenAIApi } = require("openai");
const config = require('config');
const CryptoJS = require('crypto-js')

exports.getTemplate = async (req, res) => {
    // + 交通事故的敘述 -> 歸納成 Json 的格式
    // Decrypt
    const en_OPENAI_API_KEY = config.get('chatGPT.key');
    const OPENAI_API_KEY = CryptoJS.AES.decrypt(en_OPENAI_API_KEY, "").toString(CryptoJS.enc.Utf8)
    console.log(`After decrypt => ${OPENAI_API_KEY}`)
    
    try {
        const configuration = new Configuration({
            apiKey: OPENAI_API_KEY
        });

        const openai = new OpenAIApi(configuration);

        // ! 產生可能會需要一點時間
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: [
                {
                    "role": "system",
                    "content": "你現在是一位交通諮詢的專家，現在有一件交通事故的敘述，請你將資訊歸納成如下的json的格式，如果沒有資料請保持欄位空白\n{\"發生日期\": ,\"發生時間\": ,\"發生地點\": ,\"被告駕駛交通工具\": ,\"原告駕駛交通工具\": ,\"出發地\":,\"行駛道路\": ,\"行進方向\": ,\"事發經過\": ,\n\"行進方向的號誌\": ,\"天候\": ,\"路況\": ,\"行車速度\":,\"被告車輛損壞情形\":,\"原告車輛損壞情形\":,\"被告傷勢\": ,\"原告傷勢\": }"
                },
                {
                    "role": "user",
                    "content": "<交通事故敘述>\n被告於民國109年2月11日騎乘車牌號碼000-0000號普通重型機車，行經臺中市○○區○○路○段000號前時，因未注意車前狀況之過失，不慎碰撞原告所有、停放於該處之車牌號碼000-0000號普通重型機車（下稱系爭機車），致系爭機車受損，原告因系爭機車受損支出必要之修復費用合計新臺幣（下同）17,000元（均為零件費用）。系爭機車因被告過失撞損，原告爰依侵權行為之法律關係，請求被告給付原告17,000元。"
                },
            ],
            temperature: 0.1,
            max_tokens: 1024,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        });

        console.log("🚀 ~ file: chatGPTController.js:34 ~ exports.getTemplate= ~ response.data.choices[0].message:\n", response.data.choices[0].message)
        res.status(200).send(response.data.choices[0].message.content);
        
    } catch (error) {
        console.error("Error fetching from OpenAI:", error.message || error);
        res.status(500).send(`Error fetching from OpenAI: ${error.message || error}`);
        
    }
};


// response.data.choices[0].message
