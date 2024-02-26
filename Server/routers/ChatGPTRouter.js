const { Router } = require('express');
const chatGPTController = require('../controllers/ChatGPTController');

const app = Router();

// - Action. 
app.post('/api/chatGPT/chat_test', chatGPTController.chat_test);
app.post('/api/chatGPT/templateJSON', chatGPTController.templateJSON);
app.post('/api/chatGPT/carmedJSON', chatGPTController.carmedJSON);
app.post('/api/chatGPT/otherJSON', chatGPTController.otherJSON);
app.post('/api/chatGPT/gptChat', chatGPTController.gptChat);
app.post('/api/chatGPT/getJudgementText', chatGPTController.getJudgementText);

// - 取得目前資料
app.get('/api/chatGPT/getTitle', chatGPTController.getTitle);
app.post('/api/chatGPT/getContentJson', chatGPTController.getContentJson);
app.post('/api/chatGPT/similarVerdict', chatGPTController.similarVerdict);
app.post('/api/chatGPT/getHappened', chatGPTController.getHappened);

module.exports = app;




