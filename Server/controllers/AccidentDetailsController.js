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
        verificationCode,
        refactorHappened
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
            title: requestData.title || createTime, // + " - " + requestData.userDescription, 
            historyChatContent: requestData.historyChatContent || [],
            verificationCode: requestData.verificationCode || "",
            incidentJson: requestData.incidentJson || {},
            ccgCurrentQuestion: requestData.ccgCurrentQuestion || "",
            refactorHappened: requestData.refactorHappened || "",
            iconName: requestData.iconName || "File",
        };

        // - 目前還未有任何資訊: 第一次對話
        // Object.values(requestData.incidentJson["車禍發生事故"]).filter(value => value !== "").length == 0 && 
        if (requestData._id == "") {

            // + 初始模組
            const { firstPromptModule } = require("./data/prompt")
            var firstPrompt = firstPromptModule(requestData);
            
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
                    verificationCode: requestData.verificationCode,
                    iconName: responseData.iconName,
                }
            )
            responseData._id = createNewChat_id.toString()
        }

        // - 已經有部分資訊了: 詢問還未知曉的資訊 (GPT - 1)
        else {

            // + 擷取模組
            const { tidyPromptModule } = require("./data/prompt")
            var tidyPrompt = tidyPromptModule(requestData);

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
        const { generateQuestionKeyModule } = require("./data/prompt")
        var questionKey = generateQuestionKeyModule(responseData, questionExplain);

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
                    incidentJson: responseData.incidentJson,
                    refactorHappened: responseData.refactorHappened
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
            projection = { title: 1, iconName: 1 });

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
exports.refactorEvent = async (req, res) => {
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
                    refactorHappened: responseData.refactorHappened
                }
            }
        );

        res.status(200).send(responseData);

    }
    catch (error) {
        res.status(500).send(`[RefactorEvent] Error: ${error.message || error}`);
    }
}

// ----- 當事人Agent (自動答覆)
exports.litigantAgent = async (req, res) => {

    /*
        cleanJudgementData,
        question
    */

    try {

        // - 獲得 OpenAI API
        const configCrypto = new ConfigCrypto();
        const OPENAI_API_KEY = configCrypto.config.GPT_KEY; // Get OpenAI API key
        const openai = new OpenAIApi(new Configuration({ apiKey: OPENAI_API_KEY })); // openAI API

        // - 回傳資訊
        var responseData = req.body;

        // - request data
        const requestData = req.body;

        // + 當事人模組
        const { litigantAgentModule } = require("./data/prompt")
        var agentPrompt = litigantAgentModule(requestData);

        const message = [
            { "role": "system", "content": agentPrompt }
        ]

        const gptResponse = await openai.createChatCompletion({
            model: "gpt-3.5-turbo-1106",
            messages: message,
            temperature: 0.5,
            max_tokens: 1024,
            top_p: 1,
            frequency_penalty: 0,
            presence_penalty: 0,
        });

        const responseContent = gptResponse.data.choices[0].message.content;
        responseData.agentDescription = responseContent

        res.status(200).send(responseData);
    
    }
    catch (error) {
        res.status(500).send(`[litigantAgent] Error: ${error.message || error}`);
    }

}

// ----- 更新除了對話的其他資料
exports.updateViewerData = async (req, res) => {
    /*
        title,
        _id,
        iconName
    */

    try {

        // - 呼叫資料庫 MongoDB
        const mongoDB = new MongoDB_Tools();

        // - 整理 request data
        const requestData = req.body;
        
        // - 回傳資訊
        var responseData = {
            _id: requestData._id || "",
            title: requestData.title || createTime, // + " - " + requestData.userDescription, 
            iconName: requestData.iconName || "File",
        };

        // - 儲存至資料庫內部
        await mongoDB.update(
            collectionName = 'AccidentDetails',
            query = { _id: new ObjectId(responseData._id) },
            updateOperation = {
                $set: {
                    title: responseData.title,
                    iconName: responseData.iconName
                }
            }
        );

        res.status(200).send(responseData);

    } catch (error) {
        console.error("[updateViewerData] Error fetching from OpenAI:", error.message || error);
        res.status(500).send(`[updateViewerData] Error fetching from OpenAI: ${error.message || error}`);
    }
}

// ----- 刪除資料
exports.deleteAccidentDetails = async (req, res) => {
    /*
        _id,
    */

    try {

        // - 呼叫資料庫 MongoDB
        const mongoDB = new MongoDB_Tools();

        // - 整理 Request, Response
        const requestData = req.body;
        var responseData = {
            _id: requestData._id,
            message: "刪除失敗"
        }
        
        // - 刪除資料
        await mongoDB.delete(
            collectionName = 'AccidentDetails',
            query = { _id: new ObjectId(responseData._id) },
        );

        responseData.message = "刪除成功"
        res.status(200).send(responseData);
    } catch (error) {
        console.error("[deleteAccidentDetails] Error fetching from OpenAI:", error.message || error);
        res.status(500).send(`[deleteAccidentDetails] Error fetching from OpenAI: ${error.message || error}`);
    }
}