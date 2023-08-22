const { Router } = require('express');
const chatGPTController = require('../controllers/chatGPTController')

const app = Router();
  
app.post('/chatGPT/classified_chat', chatGPTController.getTemplate);
app.post('/chatGPT/chat_test', chatGPTController.chat_test);
app.post('/chatGPT/templateJSON', chatGPTController.templateJSON);
app.post('/chatGPT/getTitle', chatGPTController.getTitle);
  
module.exports = app;