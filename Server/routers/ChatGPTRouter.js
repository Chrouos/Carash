const { Router } = require('express');
const chatGPTController = require('../controllers/ChatGPTController')

const app = Router();

// - Action. 
app.post('/chatGPT/chat_test', chatGPTController.chat_test);
app.post('/chatGPT/templateJSON', chatGPTController.templateJSON);

// - 取得目前資料
app.post('/chatGPT/getTitle', chatGPTController.getTitle);
app.post('/chatGPT/getContentJson', chatGPTController.getContentJson);
app.post('/chatGPT/similarVerdict', chatGPTController.similarVerdict);
app.post('/chatGPT/gethappened', chatGPTController.gethappened);

module.exports = app;