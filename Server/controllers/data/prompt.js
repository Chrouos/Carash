// - 事實生成模組 RefactorEvent
exports.RefactorEventPrompt = 
`以下提供了一個以Json格式表示的車禍事實。請您依照此格式，以判決書的形式重述整個車禍的經過。請注意，您只需要描述在Json格式中提供的車禍相關事實，不應包含其他無關或未提供的資訊。`

// - 初始模組
exports.firstPromptModule = (requestData) => {
    return `你現在是一件交通諮詢的專家，現在有一件交通[事故敘述]，請你將資訊歸納成如下的[事件儲存Json格式]，如果沒有資料請保持欄位空白。\n` +
    `\n[事件儲存Json格式]:\n ${JSON.stringify(requestData.incidentJson["車禍發生事故"])}` +
    `\n[事故敘述]:\n ${requestData.userDescription}` +
    `\n[Json]:`;
};

// - 提問模組
exports.generateQuestionKeyModule = (responseData, questionExplain) => {
    var questionKey = "你是一位交通諮詢代理人，使用溫柔的口氣表達對當事人發生的事感到惋惜，並且指示他'請點選下一步'。";
    for (const key in responseData.incidentJson["車禍發生事故"]) {
        if (!responseData.incidentJson["車禍發生事故"][key]) {
            questionKey = `你現在是一位交通諮詢專家，負責詢問一個有關'${key}'的問題給當事人。你的任務目標是問一個問題，而你要問的問題要依照以下[問題解釋]中'${key}'的解釋。你只能問一個問題，例如回覆'請問事故發生日期是何時?'。我方是指當事人。\n`
            questionKey += `[問題解釋] : '${key}'的意思是'${questionExplain[key]}'`
            break;
        }
    }
    return questionKey;
};

// - 擷取模組
exports.tidyPromptModule = (requestData) => {
    return `你是一位事件擷取機器人，現在有一[問題]與該[問題回覆]和一個[Json格式]，請你將[問題回覆]找到適當的key值擷取並填入至以下完整Json格式，請勿改變與增加JSON格式。若敘述中沒有提到的資訊則將此問題欄位留空，若敘述回答忘記了或不知道則將此Json格式中的此問題欄位填入'未知'。你必須回答完整以下的Json格式且只回答Json格式，不要回答其餘無關事項。` +
    `\n[Json格式]:\n ${JSON.stringify(requestData.incidentJson["車禍發生事故"])}` +
    `\n[問題]:\n ${requestData.ccgCurrentQuestion}` +
    `\n[問題回覆]:\n ${requestData.userDescription}` + 
    `\n[Json]:`;
}

