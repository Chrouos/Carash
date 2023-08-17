const { Configuration, OpenAIApi } = require("openai");
const CryptoJS = require('crypto-js')
const ConfigCrypto = require('../tools/ConfigCrypto')

var chatRecordTimes = 0;


exports.getTemplate = async (req, res) => {
    // + 交通事故的敘述 -> 歸納成 Json 的格式

    try {

        const requestData = req.body; // Data from the request.
        console.log("🚀 ~ file: chatGPTController.js:11 ~ exports.getTemplate= ~ requestData:", requestData)
        chatRecordTimes += 1;

        // Decrypt
        const configCrypto = new ConfigCrypto();
        const OPENAI_API_KEY = configCrypto.config.GPT_KEY; // Get OpenAI API key
        console.log(`After decrypt => ${OPENAI_API_KEY}`)

        const configuration = new Configuration({
            apiKey: OPENAI_API_KEY
        });

        const openai = new OpenAIApi(configuration);
        let jsonResponseData;

        if (chatRecordTimes = 1) {

            const firstmessages = [
                {
                    "role": "system",
                    "content": "你現在是一件交通諮詢的專家，現在有一件交通事故的敘述，請你將資訊歸納成如下的json格式，如果沒有資料請保持欄位空白。{\"發生日期\": \"\",\"發生時間\": \"\",\"發生地點\": \"\",\"被告駕駛交通工具\": \"\",\"原告駕駛交通工具\": \"\",\"出發地\": \"\",\"行駛道路\": \"\",\"行進方向\": \"\",\"事發經過\": \"\",\"行進方向的號誌\": \"\",\"天候\": \"\",\"路況\": \"\",\"行車速度\": \"\",\"被告車輛損壞情形\": \"\",\"原告車輛損壞情形\": \"\",\"被告傷勢\": \"\",\"原告傷勢\": \"\"}"
                },
            ]
            firstmessages.push(...requestData);
            //console.log(firstmessages);

            const firstResponse = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: firstmessages,
                temperature: 0.1,
                max_tokens: 1024,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });

            jsonResponseData = firstResponse.data.choices[0].message;
            //console.log("🚀 ~ file: chatGPTController.js:34 ~ exports.getTemplate= ~ firstResponse.data.choices[0].message:\n", firstResponse.data.choices[0].message)

        }
        else {

            const jsonMessage = [{
                "role": "system",
                "content": "現在有一個回答，是針對以下json格式的第一個沒有值的key，請依照此Json格式填入納格沒有值的key中，並且回覆整個Json格式，若使用者回覆不知道或忘記了請填入'未知'。請不要填入不相關的key中。"
            }]
            jsonMessage.push(...requestData);

            const jsonResponse = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: jsonMessage,
                temperature: 0.1,
                max_tokens: 1024,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0
            });

            jsonResponseData = jsonResponse.data.choices[0].message;
            //console.log("🚀 ~ file: chatGPTController.js:34 ~ exports.getTemplate= ~ jsonResponse.data.choices[0].message:\n", jsonResponse.data.choices[0].message)

        }


        const questionMessage = [{
            "role": "system",
            "content": "你現在是一個交通事故諮詢的機器人，請依照JSON格式中第一個沒有值的key，產生一個詢問此key的問題。"
        }]
        questionMessage.push(jsonResponseData);

        //console.log("questionMessage : ", questionMessage);

        const questionResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: questionMessage,
            temperature: 0.1,
            max_tokens: 1024,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0
        });

        const gptResponse = [questionResponse.data.choices[0].message];
        gptResponse.push(jsonResponseData);

        console.log("🚀 ~ file: chatGPTController.js:158 ~ exports.getTemplate= ~ gptResponse:", gptResponse)
        res.status(200).send(gptResponse);


    } catch (error) {
        console.error("Error fetching from OpenAI:", error.message || error);
        res.status(500).send(`Error fetching from OpenAI: ${error.message || error}`);

    }
};


// response.data.choices[0].message
exports.chat_test = async (req, res) => {
    // + 與前端的聊天測試

    try {
        const requestData = req.body; // Data from the request.
        console.log("🚀 ~ file: chatGPTController.js:71 ~ exports.chat_test= ~ requestData:", requestData)

        const messageList = [{
            "role": "user",
            "content": requestData.content
        }]

        // Decrypt
        const en_OPENAI_API_KEY = config.get('chatGPT.key');
        const OPENAI_API_KEY = CryptoJS.AES.decrypt(en_OPENAI_API_KEY, "").toString(CryptoJS.enc.Utf8)
        console.log(`After decrypt => ${OPENAI_API_KEY}`)

        const configuration = new Configuration({
            apiKey: OPENAI_API_KEY
        });

        const openai = new OpenAIApi(configuration);

        // ! 產生可能會需要一點時間
        const response = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: messageList,
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


exports.templateJSON = async (req, res) => {

    try {

        // - 獲得 OpenAI API
        const configCrypto = new ConfigCrypto();
        const OPENAI_API_KEY = configCrypto.config.GPT_KEY; // Get OpenAI API key
        const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_API_KEY })); // openAI API

        // - 回傳資訊
        var responseData = req.body;

        // - 整理 request data
        const requestData = req.body;   // Get data from the request.
        const notNullCount = Object.values(responseData.incidentJson).filter(value => value !== "").length; // 目前不是 Null 的值

        // - 目前還未有任何資訊: 第一次對話
        if (notNullCount == 0){

            const firstMessages = [
                {"role": "system","content": "你現在是一件交通諮詢的專家，現在有一件交通事故的敘述，請你將資訊歸納成如下的json格式，如果沒有資料請保持欄位空白，歸納的資訊請說明成類判決書格式。我 = 原告，對方 = 被告" + JSON.stringify(requestData.incidentJson)},
                {"role": "user", "content": requestData.content }
            ]

            const gptResponse = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: firstMessages,
                temperature: 0.1,
                max_tokens: 1024,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });

            // 回傳的有可能不是 JSON
            try {
                responseData.incidentJson = JSON.parse(gptResponse.data.choices[0].message.content);
            } catch (error) {
                console.error("Error parsing JSON:", error);
                // Handle the error or return
            }
            
        }
        
        // - 已經有部分資訊了: 詢問還未知曉的資訊 (GPT - 1)
        else{

            const tidyMessage = [
                {"role": "system","content": "現在有一個回答，是針對以下json格式的第一個沒有值的key，請依照此Json格式填入納格沒有值的key中，並且回覆整個Json格式，若使用者回覆不知道或忘記了請填入'未知'。請不要填入不相關的key中。" + JSON.stringify(requestData.incidentJson)},
                {"role": "user", "content": requestData.content } // 把目前車禍相關的 JSON 與 使用者回覆串接
            ]
            console.log("🚀 ~ file: chatGPTController.js:202 ~ exports.templateJSON= ~ tidyMessage:", tidyMessage)

            const gptResponse = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: tidyMessage,
                temperature: 0.1,
                max_tokens: 1024,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });

            // 回傳的有可能不是 JSON
            try {
                responseData.incidentJson = JSON.parse(gptResponse.data.choices[0].message.content);
            } catch (error) {
                console.error("Error parsing JSON:", error);
                // Handle the error or return
            }
            
            
        }

        // - 最後 GPT 的回覆格式
        const questionMessage = [ 
            {"role": "system", "content": "你現在是一個交通事故諮詢的機器人，請依照JSON格式中第一個沒有值的key，產生一個詢問此key的問題。"},
            {"role": "user", "content": JSON.stringify(requestData.incidentJson)}
        ]
        console.log("🚀 ~ file: chatGPTController.js:223 ~ exports.templateJSON= ~ questionMessage:", questionMessage)

        const gptResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: questionMessage,
            temperature: 0.1,
            max_tokens: 1024,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        responseData.content = gptResponse.data.choices[0].message.content;
        res.status(200).send(responseData);

    } catch (error) {
        console.error("[templateJSON] Error fetching from OpenAI:", error.message || error);
        res.status(500).send(`[templateJSON] Error fetching from OpenAI: ${error.message || error}`);
    }
};


/*

1:
108年4月30日，大概早上十點多的時候，我騎重機在中山路附近行駛。
有台轎車沒有遵守交通號誌，闖紅燈，撞到我害我倒地，左邊膝蓋開放性骨折還有很多擦傷。

2:
我從北投區出發，那天氣晴，路況正常，我當時行駛車速大約50公里，我的車後燈損壞及車身有些擦傷

*/