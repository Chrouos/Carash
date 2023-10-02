const { Configuration, OpenAIApi } = require("openai");
const CryptoJS = require('crypto-js')
const ConfigCrypto = require('../tools/ConfigCrypto')
const ChromaDB_Tools = require('../tools/ChromaTools');
const MongoDB_Tools = require('../tools/MongoDbTools');
const ObjectId = require("mongodb").ObjectId;

// -------------------- 測試 GPT
exports.chat_test = async (req, res) => {
    // + 與前端的聊天測試

    try {
        const requestData = req.body; // Data from the request.
        const messageList = [{
            "role": "user",
            "content": requestData.content
        }]

        // - 獲得 OpenAI API
        const configCrypto = new ConfigCrypto();
        const OPENAI_API_KEY = configCrypto.config.GPT_KEY; // Get OpenAI API key
        const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_API_KEY })); // openAI API

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

// -------------------- 獲得所有對話紀錄的名稱
exports.getTitle = async (req, res) => {
    try {
        var responseData = {}; // = 定義回傳變數

        const dbTools = new MongoDB_Tools();
        const titles = await dbTools.read('AccidentDetails', {}, { title: 1 });
       
        responseData.titles = titles

        res.status(200).send(responseData);
    }
    catch (error) {
        console.error("[getTitle] Error :", error.message || error);
        res.status(500).send(`[getTitle] Error : ${error.message || error}`);
    }
}

// -------------------- 獲得指定對話紀錄的內容和JSON
exports.getContentJson = async (req, res) => {
    try {

        // - 車禍 Json 的資料取出
        const dbTools = new MongoDB_Tools();
        const responseData = await dbTools.read(
            collectionName = 'AccidentDetails',
            query = { _id: new ObjectId(req.body.ids) },
        )

        res.status(200).send(responseData[0]);
    }
    catch (error) {
        console.error("[getContentJson] Error :", error.message || error);
        res.status(500).send(`[getContentJson] Error : ${error.message || error}`);
    }
}

// -------------------- 對話模板
exports.templateJSON = async (req, res) => {
    /*
        ResponseData.
            content,
            question,
            incidentJson,
            title,
            ids,
            chatContent
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

        // - 呼叫資料庫 MongoDB
        const dbTools = new MongoDB_Tools();

        // - 取得台灣的即時時間
        const taiwanTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Taipei" });
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
            } catch (error) {
                console.error("🐛 chatGPTController - parse Json Failed:", error);
            }

            // - 資料庫 第一次對話（因此需要產生聊天室）
            const insertedId = await dbTools.create(
                collectionName = 'AccidentDetails', 
                document = {
                    title: responseData.title || 'Default title',
                    chatContent: [{
                        character: 'chatBot', 
                        value: "你好，我可以幫你什麼？\n請簡述你所知道的案件狀況，包含時間地點、人員傷勢、車況，事發情況等等... ", 
                        createTime: createTime
                    }],
                    incidentJson: requestData.incidentJson
                }
            )
            responseData.ids = insertedId.toString()
        }

        // - 已經有部分資訊了: 詢問還未知曉的資訊 (GPT - 1)
        else {

            const tidyMessage = [
                { "role": "system", "content": "你是一位事件擷取機器人，現在有一問題與該問題的敘述和一個Json格式，請你將資訊歸納以及加入以下完整Json格式，若敘述中沒有提到的資訊則將此問題欄位留空，若敘述回答不知道則將此Json格式中的此問題欄位填入'未知'。你必須回答完整以下的Json格式且只回答Json格式，不要回答其餘無關事項。我是原告。" + JSON.stringify(requestData.incidentJson) },
                { "role": "assistant", "content": requestData.question },
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
            { "role": "system", "content": "你現在是一個交通事故諮詢的機器人，請依照JSON格式中依序檢查首個空值value的key，產生一個詢問此key的問題。若是依序檢查JSON格式中沒有空值value或是value為 \"未知 \"，則直接回答 \"請點擊確認輸出內容。\"。請不要回答問題以外的東西，你只需要提問就好，也不要回答無關的問題。" },
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
        responseData.question = responseContent;
        const newContent = [
            { character: 'questioner', value: userContent, createTime0
            : createTime },
            { character: 'chatBot', value: responseContent, createTime: createTime }
        ]
        responseData.chatContent.push(... newContent);

        // - 儲存至資料庫內部
        await dbTools.update(
            collectionName = 'AccidentDetails',
            query = { _id: new ObjectId(responseData.ids) }, 
            updateOperation = { 
                $push: { 
                    chatContent: { $each: newContent } 
                },
                $set: {
                    incidentJson: responseData.incidentJson
                }
            }
        );

        res.status(200).send(responseData);

    } catch (error) {
        console.error("[templateJSON] Error fetching from OpenAI:", error.message || error);
        res.status(500).send(`[templateJSON] Error fetching from OpenAI: ${error.message || error}`);
    }
};

// -------------------- 尋找相似判決
exports.similarVerdict = async (req, res) => {
    try {

        const requestData = req.body;
        var responseData = {};

        // - 呼叫資料庫 ChromaDB
        const chromadb = new ChromaDB_Tools("Traffic_Advisory_Final");
        const results = await chromadb.query({
            nResults: 5,
            queryTexts: [requestData['happened']]
        })

        const combined = results.ids[0].map((id, index) => {
            return {
                id: id,
                happened: results.metadatas[0][index].happened,
                money: results.metadatas[0][index].money
            };
        });
        responseData = combined;

        res.status(200).send(responseData);
    }
    catch (error) {
        console.error("[similarVerdict] Error :", error.message || error);
        res.status(500).send(`[similarVerdict] Error : ${error.message || error}`);
    }
}

// ----------------- 生成事件經過
exports.getHappened = async (req, res) => {
    try {

        const configCrypto = new ConfigCrypto();
        const OPENAI_API_KEY = configCrypto.config.GPT_KEY; // Get OpenAI API key
        const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_API_KEY })); // openAI API

        const requsetData = req.body;

        const happenedMessage = [
            { "role": "system", "content": "以下有一個Json格式表示了整個車禍事實，依照此格式重述整個車禍的經過，用類似於判決書的形式描述。只要講述有資料的車禍經過就好，不能敘述Json格式內其他無關事實與未提供的資料。" },
            { "role": "user", "content": JSON.stringify(requsetData.incidentJson) },
        ]

        const gptResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo",
            messages: happenedMessage,
            temperature: 0.1,
            max_tokens: 1024,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        const responseData = gptResponse.data.choices[0].message.content;
        res.status(200).send(responseData);

    }
    catch (error) {
        console.error("[getHappened] Error :", error.message || error);
        res.status(500).send(`[getHappened] Error : ${error.message || error}`);
    }
}



/*

1:
108年4月30日，大概早上十點多的時候，我騎重機在中山路附近行駛。有台轎車沒有遵守交通號誌，闖紅燈，撞到我害我倒地，左邊膝蓋開放性骨折還有很多擦傷。

2:
我當時從北投區出發，我的行進方向是綠燈，那天天氣晴朗，路況正常，我當時行駛車速大約50公里，我的車後燈損壞及車身有些擦傷。

*/