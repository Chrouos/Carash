const { Router } = require('express');
const chatGPTController = require('../controllers/chatGPTController')

const app = Router();
  
app.post('/chatGPT/classified_chat', chatGPTController.getTemplate);
app.post('/chatGPT/chat_test', chatGPTController.chat_test);
app.post('/chatGPT/templateJSON', chatGPTController.templateJSON);
  
module.exports = app;