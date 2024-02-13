const { Configuration, OpenAIApi } = require("openai");
const CryptoJS = require('crypto-js')
const ConfigCrypto = require('../tools/ConfigCrypto')
const ChromaDB_Tools = require('../tools/ChromaTools');
const MongoDB_Tools = require('../tools/MongoDbTools');
const ObjectId = require("mongodb").ObjectId;
const { getTaiwanTime, toISO, toHumanReadable } = require('../tools/TimeTools');

// ----- 擷取對話 -> incidentJson.車禍發生事故
exports.retrievalContent = async (req, res) => {
    /*
        ccgCurrentQuestion: 機器人的提問,    
        userDescription: 使用者的描述,
        incidentJson,
        title,
        _id,
        historyChatContent,
        verificationCode
    */

    try {

        // 問題解釋格式
        const questionExplain = {
            '事故發生日期': '描述事故發生的具體日期',
            '事故發生時間': '描述事故發生的具體時間',
            '事故發生地點': '發生地點地址哪條路',
            '對方駕駛交通工具': '描述對方駕駛的交通工具種類',
            '我方駕駛交通工具': '描述我方駕駛的交通工具種類',
            '我方行駛道路': '指明我方行駛的具體道路',
            '事發經過': '提供有關事故發生時的詳細經過描述',
            '我方行進方向的號誌': '描述我方行駛方向的交通號誌狀態',
            '當天天候': '描述事故發生當天的天氣情況',
            '道路狀況': '提供有關道路狀況的資訊，例如是否有施工、是否濕滑等',
            '我方行車速度': '描述我方行駛時的車速',
            '我方車輛損壞情形': '描述我方車輛在事故中的損壞情況',
            '我方傷勢': '描述我方在事故中的傷勢情況',
            '對方車輛損壞情形': '描述對方車輛在事故中的損壞情況',
            '對方傷勢': '描述對方在事故中的傷勢情況',
            '我方從哪裡出發': '提供我方駕駛起點的資訊',
            '我方出發目的地': '提供我方駕駛的目的地資訊',
            '我方出發目的是什麼': '描述我方駕駛出發的原因或目的',
        }

        // - 取得台灣的即時時間
        const currentTaiwanTime = getTaiwanTime();
        const createTime = toHumanReadable(currentTaiwanTime);

        // - 呼叫資料庫 MongoDB
        const mongoDB = new MongoDB_Tools();

        // - 獲得 OpenAI API
        const configCrypto = new ConfigCrypto();
        const OPENAI_API_KEY = configCrypto.config.GPT_KEY; // Get OpenAI API key
        const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_API_KEY })); // openAI API

        // - 整理 request data
        const requestData = req.body;
        
        // - 回傳資訊
        var responseData = {
            _id: requestData._id || "",
            title: requestData.title || createTime + " - " + requestData.userDescription, 
            historyChatContent: requestData.historyChatContent || [],
            verificationCode: requestData.verificationCode || "",
            incidentJson: requestData.incidentJson || {},
            ccgCurrentQuestion: requestData.ccgCurrentQuestion || "",
            refactorHappened: requestData.refactorHappened || ""
        };

        // - 目前還未有任何資訊: 第一次對話
        if (Object.values(requestData.incidentJson["車禍發生事故"]).filter(value => value !== "").length == 0) {

            // + 初始模組
            firstPrompt = `你現在是一件交通諮詢的專家，現在有一件交通[事故敘述]，請你將資訊歸納成如下的[事件儲存Json格式]，如果沒有資料請保持欄位空白。\n` +
            `\n[事件儲存Json格式]:\n ${JSON.stringify(requestData.incidentJson["車禍發生事故"])}` +
            `\n[事故敘述]:\n ${requestData.userDescription}` +
            `\n[Json]:`;

            const firstMessages = [ { "role": "system", "content": firstPrompt } ]
            const gptResponse = await openai.createChatCompletion({
                model: "gpt-3.5-turbo-1106",
                messages: firstMessages,
                temperature: 0.5,
                max_tokens: 1024,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });

            // ~ 回傳的有可能不是 JSON
            try { responseData.incidentJson["車禍發生事故"] = JSON.parse(gptResponse.data.choices[0].message.content);} 
            catch (error) { console.log("firstMessages 回傳不是 Json 錯誤 :\n", gptResponse.data.choices[0].message.content) }

            // - 資料庫 第一次對話（因此需要產生聊天室）
            const createNewChat_id = await mongoDB.create(
                collectionName = 'AccidentDetails',
                document = {
                    title: responseData.title,
                    historyChatContent: [],
                    incidentJson: responseData.incidentJson,
                    verificationCode: requestData.verificationCode
                }
            )
            responseData._id = createNewChat_id.toString()
        }

        // - 已經有部分資訊了: 詢問還未知曉的資訊 (GPT - 1)
        else {

            // + 擷取模組
            tidyPrompt = 
            `你是一位事件擷取機器人，現在有一[問題]與該[問題回覆]和一個[Json格式]，請你將[問題回覆]找到適當的key值擷取並填入至以下完整Json格式，請勿改變與增加JSON格式。若敘述中沒有提到的資訊則將此問題欄位留空，若敘述回答忘記了或不知道則將此Json格式中的此問題欄位填入'未知'。你必須回答完整以下的Json格式且只回答Json格式，不要回答其餘無關事項。` +
            `\n[Json格式]:\n ${JSON.stringify(requestData.incidentJson["車禍發生事故"])}` +
            `\n[問題]:\n ${requestData.ccgCurrentQuestion}` +
            `\n[問題回覆]:\n ${requestData.userDescription}` + 
            `\n[Json]:`;

            tidyMessage = [{ "role": "system", "content": tidyPrompt }]
            const gptResponse = await openai.createChatCompletion({
                model: "gpt-3.5-turbo-1106",
                messages: tidyMessage,
                temperature: 0.5,
                max_tokens: 1024,
                top_p: 1,
                frequency_penalty: 0,
                presence_penalty: 0,
            });

            // ~ 回傳的有可能不是 JSON
            try { responseData.incidentJson["車禍發生事故"] = JSON.parse(gptResponse.data.choices[0].message.content); } 
            catch (error) { console.log("Error gptResponse :\n", gptResponse.data.choices[0].message.content) }
        }

        // + 提問模組
        var questionKey = "你是一位交通諮詢代理人，使用溫柔的口氣表達對當事人發生的事感到惋惜，並且指示他'請點選下一步'。";
        for (const key in responseData.incidentJson["車禍發生事故"]) {
            if (!responseData.incidentJson["車禍發生事故"][key]) {
                // responseData.ccgCurrentQuestion = `詢問一個有關${key}的問題`
                questionKey = `你現在是一位交通諮詢專家，負責詢問一個有關'${key}'的問題給當事人。你的任務目標是問一個問題，而你要問的問題要依照以下[問題解釋]中'${key}'的解釋。你只能問一個問題，例如回覆'請問事故發生日期是何時?'。我方是指當事人。\n`
                questionKey += `[問題解釋] : '${key}'的意思是'${questionExplain[key]}'`
                break;
            }
        }

        const questionMessage = [ { "role": "system", "content": questionKey }, ]
        const gptResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo-1106",
            messages: questionMessage,
            temperature: 0.5,
            max_tokens: 1024,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });
        const responseContent = gptResponse.data.choices[0].message.content;
        responseData.ccgCurrentQuestion = responseContent;

        // - 回傳結果
        const newContent = [ 
            { character: 'questioner', value: requestData.userDescription, createTime: createTime } ,
            { character: 'chatBot', value: responseContent, createTime: createTime } 
        ]
        responseData.historyChatContent.push(...newContent);

        // - 儲存至資料庫內部
        await mongoDB.update(
            collectionName = 'AccidentDetails',
            query = { _id: new ObjectId(responseData._id) },
            updateOperation = {
                $push: {
                    historyChatContent: { $each: newContent }
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
}

// -----  獲得標題
exports.getAccidentDetailsTitle = async (req, res) => {

    try {

        var responseData = {}; // = 定義回傳變數
        const verificationCode = req.body.verificationCode || "";

        const dbTools = new MongoDB_Tools();
        const titles = await dbTools.read(
            collectionName = 'AccidentDetails', 
            query = {verificationCode: verificationCode}, 
            sort = {"historyChatContent.createTime": -1}, // 根據對話的最新時間排序
            projection = { title: 1 });

        responseData.titles = titles
        res.status(200).send(responseData);

    } catch (error) {
        res.status(500).send(`[getAccidentDetailsTitle] Error: ${error.message || error}`);
    }

}

// ----- 根據 Id 獲得該所有內容
exports.getContentAndJson = async (req, res) => {
    try {

        var responseData = {}; // = 定義回傳變數

        // - 車禍 Json 的資料取出
        const dbTools = new MongoDB_Tools();
        responseData = await dbTools.read(
            collectionName = 'AccidentDetails',
            query = { _id: new ObjectId(req.body._id) },
            limit = "1",
        )

        res.status(200).send(responseData[0]);
    } catch (error) {
        res.status(500).send(`[getContentAndJson] Error: ${error.message || error}`);
    }

}

// ----- 重構事件
exports.RefactorEvent = async (req, res) => {
    try {

        const requestData = req.body;
        var responseData = {}
        
        // - Prompt
        const { RefactorEventPrompt } = require("./data/prompt")

        // - OpenAI
        const configCrypto = new ConfigCrypto();
        const OPENAI_API_KEY = configCrypto.config.GPT_KEY; // Get OpenAI API key
        const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_API_KEY })); // openAI API
    
        // - 呼叫資料庫 MongoDB
        const mongoDB = new MongoDB_Tools();

        // + 還原事實模組
        const happenedMessage = [
            { "role": "system", "content": RefactorEventPrompt },
            { "role": "user", "content": JSON.stringify(requestData.incidentJson) },
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

        responseData.refactorHappened = gptResponse.data.choices[0].message.content;
        responseData.message = "重構事發經過成功"

        // - 存到資料庫
        await mongoDB.update(
            collectionName = 'AccidentDetails',
            query = { _id: new ObjectId(requestData._id) },
            updateOperation = {
                $set: {
                    refactorHappened: responseData.happened
                }
            }
        );

        res.status(200).send(responseData);

    }
    catch (error) {
        console.error("[getHappened] Error :", error.message || error);
        res.status(500).send(`[getHappened] Error : ${error.message || error}`);
    }
}
