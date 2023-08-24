const { Configuration, OpenAIApi } = require("openai");
const CryptoJS = require('crypto-js')
const ConfigCrypto = require('../tools/ConfigCrypto')

var chatRecordTimes = 0;
const ChromaDB_Tools = require('../tools/ChromaTools');

exports.getTemplate = async (req, res) => {
    // + 交通事故的敘述 -> 歸納成 Json 的格式

    try {

        const requestData = req.body; // Data from the request.
        chatRecordTimes += 1;

        // Decrypt
        const configCrypto = new ConfigCrypto();
        const OPENAI_API_KEY = configCrypto.config.GPT_KEY; // Get OpenAI API key

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

        }


        const questionMessage = [{
            "role": "system",
            "content": "你現在是一個交通事故諮詢的機器人，請依照JSON格式中第一個沒有值的key，產生一個詢問此key的問題。"
        }]
        questionMessage.push(jsonResponseData);


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

        const messageList = [{
            "role": "user",
            "content": requestData.content
        }]

        // Decrypt
        const en_OPENAI_API_KEY = config.get('chatGPT.key');
        const OPENAI_API_KEY = CryptoJS.AES.decrypt(en_OPENAI_API_KEY, "").toString(CryptoJS.enc.Utf8)

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

        res.status(200).send(response.data.choices[0].message.content);

    } catch (error) {
        console.error("Error fetching from OpenAI:", error.message || error);
        res.status(500).send(`Error fetching from OpenAI: ${error.message || error}`);

    }
};

exports.getTitle = async(req, res) => {
    try {
        const chromadb = new ChromaDB_Tools("Traffic_Advisory");
        const titles = await chromadb.peek();
        const responseData = titles.ids.map((id, index) => {
            return Object.assign({}, {id: id}, titles.metadatas[index]);
        });

        res.status(200).send(responseData);
    }
    catch (error) {
        console.error("[getTitle] Error :", error.message || error);
        res.status(500).send(`[getTitle] Error : ${error.message || error}`);
    }
}

exports.getContentJson = async(req, res) => {
    try {

        var responseData = {};

        // - 車禍 Json 的資料取出
        const chromadb_json = new ChromaDB_Tools("Traffic_Advisory_Json");
        const responseJson = await chromadb_json.get({
            ids: req.body.ids
        });

        // - 聊天內容 的資料取出
        const chromadb_content = new ChromaDB_Tools("Traffic_Advisory_Content");
        const responseContent = await chromadb_content.get({
            where: { ids: req.body.ids },
        });

        // - 聊天名稱 的資料取出
        const chromadb = new ChromaDB_Tools("Traffic_Advisory");
        const response = await chromadb.get({
            ids: req.body.ids
        });
        
        // - 準備輸出內容
        responseData.totalContent = responseContent.metadatas;
        responseData.incidentJson = responseJson.metadatas[0];
        responseData.title = response.documents;
        
        res.status(200).send(responseData);
    }
    catch (error) {
        console.error("[getContentJson] Error :", error.message || error);
        res.status(500).send(`[getContentJson] Error : ${error.message || error}`);
    }
}


exports.templateJSON = async (req, res) => {
    /*
        ResponseData.
            content,
            incidentJson,
            title,
            ids,
            totalContent
    */

    try {

        // - 獲得 OpenAI API
        const configCrypto = new ConfigCrypto();
        const OPENAI_API_KEY = configCrypto.config.GPT_KEY; // Get OpenAI API key
        const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_API_KEY })); // openAI API

        // - 回傳資訊
        var responseData = req.body;
        const userContent = req.body.content;

        // - 整理 request data
        const requestData = req.body;   
        const notNullCount = Object.values(responseData.incidentJson).filter(value => value !== "").length; // 目前不是 Null 的值

        // - 呼叫資料庫 ChromaDB
        const chromadb = new ChromaDB_Tools("Traffic_Advisory");
        const chromadb_json = new ChromaDB_Tools("Traffic_Advisory_Json");
        const chromadb_content = new ChromaDB_Tools("Traffic_Advisory_Content");

        // - 取得台灣的即時時間
        const taiwanTime = new Date().toLocaleString("en-US", {timeZone: "Asia/Taipei"});
        const createTime = new Date(taiwanTime).toISOString();

        // - 目前還未有任何資訊: 第一次對話
        if (notNullCount == 0) {

            const firstMessages = [
                { "role": "system", "content": "你現在是一件交通諮詢的專家，現在有一件交通事故的敘述，請你將資訊歸納成如下的json格式，如果沒有資料請保持欄位空白，歸納的資訊請說明成類判決書格式。我 = 原告，對方 = 被告" + JSON.stringify(requestData.incidentJson) },
                { "role": "user", "content": requestData.content }
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
                responseData.ids = await chromadb.nextIds();

                chromadb_content.add({
                    metadatas: [{ids: responseData.ids, character: 'chatBot',  value: "你好，我可以幫你什麼？\n請簡述你所知道的案件狀況，包含時間地點、人員傷勢、車況，事發情況等等... ", createTime: createTime}],
                    documents: "你好，我可以幫你什麼？\n請簡述你所知道的案件狀況，包含時間地點、人員傷勢、車況，事發情況等等... ",
                })
            } catch (error) {
                console.error("Error parsing JSON:", error);
            }
        }

        // - 已經有部分資訊了: 詢問還未知曉的資訊 (GPT - 1)
        else {

            const tidyMessage = [
                { "role": "system", "content": "你是一位事件擷取機器人，現在有一個描述是針對以下json格式中空白value的回答，請加入以下整個Json，並且依照Json格式回覆，若沒有資料請保留空白值，請不要更改或填入不相關的key中。若是我告訴你'不知道'，才填入'未知'，不然不能填入。我是原告的角度。" + JSON.stringify(requestData.incidentJson) },
                { "role": "user", "content": requestData.content } // 把目前車禍相關的 JSON 與 使用者回覆串接
            ]

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
            }
        }

        // - 最後 GPT 的回覆格式
        const questionMessage = [
            { "role": "system", "content": "你現在是一個交通事故諮詢的機器人，請依照JSON格式中第一個沒有value的key，產生一個詢問此key的問題。請不要回答問題以外的東西，你只需要提問就好。若是整個JSON格式滿了，你沒有問題可以問，你就必須要回答'請點擊確認輸出內容。'。" },
            { "role": "user", "content": JSON.stringify(requestData.incidentJson) }
        ]

        const gptResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: questionMessage,
            temperature: 0.1,
            max_tokens: 1024,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        const responseContent = gptResponse.data.choices[0].message.content;

        // - 回傳結果
        responseData.content = responseContent;
        const newContent = [
            {ids: responseData.ids, character: 'questioner', value: userContent, createTime: createTime},
            {ids: responseData.ids, character: 'chatBot', value: responseContent, createTime: createTime}
        ]
        responseData.totalContent.push(
            {ids: responseData.ids,character: 'questioner', value: userContent, createTime: createTime},
            {ids: responseData.ids, character: 'chatBot', value: responseContent, createTime: createTime});

        // - 儲存至資料庫內部
        if (notNullCount === 0){
            chromadb.add({
                ids: responseData.ids,
                metadatas: [{title: responseData.title || "testChatBox"}],
                documents: responseData.title || "testChatBox"
            })
            chromadb_json.add({
                ids: responseData.ids,
                metadatas: [responseData.incidentJson],
                documents: responseData.incidentJson['事發經過']
            })
        }
        else{
            chromadb.update({
                ids: responseData.ids,
                metadatas: [{title: responseData.title || "testChatBox"}],
                documents: responseData.title || "testChatBox"
            })
            chromadb_json.update({
                ids: responseData.ids,
                metadatas: [responseData.incidentJson],
                documents: responseData.incidentJson['事發經過']
            })
        }
        
        chromadb_content.add({
            metadatas: newContent,
            documents: [userContent, responseContent],
        })
        
        res.status(200).send(responseData);

    } catch (error) {
        console.error("[templateJSON] Error fetching from OpenAI:", error.message || error);
        res.status(500).send(`[templateJSON] Error fetching from OpenAI: ${error.message || error}`);
    }
};


/*

1:
108年4月30日，大概早上十點多的時候，我騎重機在中山路附近行駛。有台轎車沒有遵守交通號誌，闖紅燈，撞到我害我倒地，左邊膝蓋開放性骨折還有很多擦傷。

2:
我當時從北投區出發，我的行進方向是綠燈，那天天氣晴朗，路況正常，我當時行駛車速大約50公里，我的車後燈損壞及車身有些擦傷。

*/