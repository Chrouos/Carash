const { Configuration, OpenAIApi } = require("openai");
const config = require('config');
const CryptoJS = require('crypto-js')

var chatRecordTimes = 0;
const lawJson = {
    "發生日期": "",
    "發生時間": "",
    "發生地點": "",
    "被告駕駛交通工具": "",
    "原告駕駛交通工具": "",
    "出發地": "",
    "行駛道路": "",
    "行進方向": "",
    "事發經過": "",
    "行進方向的號誌": "",
    "天候": "",
    "路況": "",
    "行車速度": "",
    "被告車輛損壞情形": "",
    "原告車輛損壞情形": "",
    "被告傷勢": "",
    "原告傷勢": ""
}
const myJson = lawJson;

exports.getTemplate = async (req, res) => {
    // + 交通事故的敘述 -> 歸納成 Json 的格式


    try {
        const requestData = req.body; // Data from the request.
        console.log("🚀 ~ file: chatGPTController.js:11 ~ exports.getTemplate= ~ requestData:", requestData)
        chatRecordTimes += 1;

        // Decrypt
        const en_OPENAI_API_KEY = config.get('chatGPT.key');
        const OPENAI_API_KEY = CryptoJS.AES.decrypt(en_OPENAI_API_KEY, "").toString(CryptoJS.enc.Utf8)
        console.log(`After decrypt => ${OPENAI_API_KEY}`)

        const configuration = new Configuration({
            apiKey: OPENAI_API_KEY
        });

        const openai = new OpenAIApi(configuration);

        if (chatRecordTimes = 1) {

            const firstmessages = [
                {
                    "role": "system",
                    "content": "你現在是一件交通諮詢的專家，現在有一件交通事故的敘述，請你將資訊歸納成如下的json格式，如果沒有資料請保持欄位空白。{\"發生日期\": \"\",\"發生時間\": \"\",\"發生地點\": \"\",\"被告駕駛交通工具\": \"\",\"原告駕駛交通工具\": \"\",\"出發地\": \"\",\"行駛道路\": \"\",\"行進方向\": \"\",\"事發經過\": \"\",\"行進方向的號誌\": \"\",\"天候\": \"\",\"路況\": \"\",\"行車速度\": \"\",\"被告車輛損壞情形\": \"\",\"原告車輛損壞情形\": \"\",\"被告傷勢\": \"\",\"原告傷勢\": \"\"}"
                },
            ]

            firstmessages.push({ "role": "user", "content": requestData.content });

            const firstResponse = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: firstmessages,
                temperature: 0.1,
                max_tokens: 1024,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });

            const jsonResponseData = JSON.parse(firstResponse.data.choices[0].message.content);

            for (const key in jsonResponseData) {
                if (jsonResponseData.hasOwnProperty(key)) {
                    myJson[key] = jsonResponseData[key];
                }
            }

            console.log("🚀 ~ file: chatGPTController.js:34 ~ exports.getTemplate= ~ response.data.choices[0].message:\n", firstResponse.data.choices[0].message)

        }


        for (const key of myJson) {
            if (myJson.hasOwnProperty(key)) {
                if (myJson[key].trims().length === 0) {

                    console.log(`"${key}"的值為空`);

                    const questionMessage = [{
                        "role": "system",
                        "content": `你現在是一個交通事故諮詢的機器人，請產生一個詢問"${myJson[key]}"的提問`
                    }]
                    const answerMessage = [{
                        "role": "system",
                        "content": `現在有一個關於"${myJson[key]}"的描述，若使用者回覆不知道或忘記請填入"未知"請依照以下json 格式回覆：{“${myJson[key]}”：}`
                    }]

                    break;

                }
                else {

                    console.log(`"${key}"的值為不為空`)
                }
            }
        }


        const questionResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: questionMessage,
            temperature: 0.1,
            max_tokens: 1024,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        });

        answerMessage.push({ "role": "user", "content": requestData.content });

        const jsonResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: answerMessage,
            temperature: 0.1,
            max_tokens: 1024,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        });

        myJson = jsonResponse;

        const gptResponse = questionResponse.data.choices[0].message;

        console.log("🚀 ~ file: chatGPTController.js:34 ~ exports.getTemplate= ~ response.data.choices[0].message:\n", gptResponse)

        res.status(200).send(gptResponse.content);


    } catch (error) {
        console.error("Error fetching from OpenAI:", error.message || error);
        res.status(500).send(`Error fetching from OpenAI: ${error.message || error}`);

    }
};


// response.data.choices[0].message
