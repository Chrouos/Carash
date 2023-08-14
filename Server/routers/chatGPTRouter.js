const { Router } = require('express');
const chatGPTController = require('../controllers/chatGPTController')

const app = Router();
  
app.post('/classified_chat', chatGPTController.getTemplate);
app.post('/chat_test', chatGPTController.chat_test);
  
module.exports = app;