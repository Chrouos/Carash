// - 事實生成模組 RefactorEvent
exports.refactorEventPromptModule = (requestData) => {
    var refactorEventPrompt = `你是一個車禍諮詢專家，以下提供了一個以Json格式表示的車禍事實，請您依照此格式提供的資訊，用敘述的方式重述整個車禍的經過。請注意，您只需要描述在Json格式中提供的車禍相關事實，不應包含其他無關或未提供的資訊。\n` +
    `[Json]: ${requestData.incidentJson["車禍發生事故"]}`;
    return refactorEventPrompt;
};

// - 初始模組
exports.firstPromptModule = (requestData) => {
    var firstPrompt = `你現在是一件交通諮詢的專家，現在有一件交通[事故敘述]，請你將資訊歸納成如下的[事件儲存Json格式]，如果[事故敘述]中沒有提到的資料請保持欄位空白。\n` +
    `\n[事件儲存Json格式]:\n ${JSON.stringify(requestData.incidentJson["車禍發生事故"])}` +
    `\n[事故敘述]:\n ${requestData.userDescription}` +
    `\n[Json]:`;

    return firstPrompt;
};

// - 提問模組
exports.generateQuestionKeyModule = (responseData, questionExplain) => {
    var questionprompt = `你是一位交通諮詢代理人，使用溫柔的口氣表達對當事人發生的事感到惋惜，現在已經結束了諮詢對話，請當事人再次確認表格是否正確，若要更改表格內容，請指示他點選'事件細節'中最下層的'編輯'，編輯完成點選'儲存'即可，若不需更改表格，則直接點選'事件生成'還原事發經過。\n` +
    `\n[Json]:\n ${JSON.stringify(responseData.incidentJson["車禍發生事故"])}`;
    for (const key in responseData.incidentJson["車禍發生事故"]) {
        if (!responseData.incidentJson["車禍發生事故"][key]) {
            // 若已兩次則選擇下一個問題
            if (responseData.twiceFlag == true) {
                responseData.twiceFlag = false;
                responseData.incidentJson["車禍發生事故"][key] = "未知";
                continue;
            }
            
            questionprompt = `作為一名「車禍事故顧問專家」，你的兩項主要任務是：\n1. 若當事人回答不符合問題，根據專家上一個問題與當事人的回答，適當的回應當事人。\n2. 根據以下[下一個問題與問題解釋]中的內容，你必須詢問一個${key}相關的問題。\n\n當當事人回答問題後，若當事人的回答與問題不相關，以友善且專業的態度引導當事人回答正確問題。\n若當事人回答正確，請根據以下[下一個問題與問題解釋]中提供的內容，提出一個有關${key}的下一個問題。確保你的問題清晰且有針對性，以幫助當事人更好地理解並回答。\n你只需要問一個問題就好，不要有過多的贅字與解釋。\n\n` +
            `- [專家上一個問題]: \"${responseData.ccgCurrentQuestion}\"\n\n` +
            `- [當事人回答]: \"${responseData.userDescription}\"\n\n` +
            `- [下一個問題與問題解釋]: 詢問一個'${key}'的問題，他的意思是'${questionExplain[key]}'\n\n` +
            // `選擇合適的專家回應（視情況而定），並確保回應不是照本宣科，而是具體且有建設性的：\n- 對於不相關的回答：\"我理解你可能對這個問題感到困惑，為了幫助你更好地理解，我建議...（提供具體建議）\"\n- 對於顯得緊張的當事人：\"沒問題，我們都在這裡幫助你。關於你提到的...（給予具體建議或安慰）\"\n\n` +
            `- [你的回覆]:\n\n` ;
            
            // 若和上一問題一樣則再給一次機會
            if (key == responseData.ccgLastQuestionKey) {
                responseData.twiceFlag = true;
            }
            else {
                responseData.twiceFlag = false;
            }
            responseData.ccgLastQuestionKey = key;
            break;
        }
    }

    return questionprompt;
};

// - 擷取模組
exports.tidyPromptModule = (requestData) => {

    var tidyPrompt = `你是一位事件擷取機器人，現在有一[問題]與該[問題回覆]和一個[Json格式]，請你將[問題回覆]找到適當的key值擷取並填入至以下完整Json格式，請勿改變與增加JSON格式。在敘述中沒有提到的資訊則將此問題欄位留空不要填入任何文字，若敘述回答忘記了或不知道則將此Json格式中的此問題欄位填入'未知'。你必須回答完整以下的Json格式且只回答Json格式，不要回答其餘無關事項。\n` +
    `[Json格式]:\n ${JSON.stringify(requestData.incidentJson["車禍發生事故"])}\n` +
    `[問題]:\n ${requestData.ccgCurrentQuestion}\n` +
    `[問題回覆]:\n ${requestData.userDescription}\n` +
    `[Json]:\n`;

    return tidyPrompt;
}

// - 當事人模組
exports.litigantAgentModule = (requestData) => {
    var agentPrompt = `請扮演以下[車禍事故報告]中的當事人，以原告的角度，依照[車禍事故報告]描述，使用簡答的方式回答警察的問題。若警察的問題在[車禍事故報告]未提及，請回答'不記得'、或'忘記了'。` + 
    `\n[車禍事故]:\n${requestData.selectJudgment}\n` +
    `\n[警察的問題]:\n${requestData.question}\n` +
    `你的問答:\n`;

    return agentPrompt;
}