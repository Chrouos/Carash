const { Router } = require('express');
const chatGPTController = require('../controllers/chatGPTController')

const app = Router();
  
app.get('/classified_chat', chatGPTController.getTemplate);
  
module.exports = app;