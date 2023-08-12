const { Router } = require('express');
const chatGPTController = require('../controllers/chatGPTController')

const app = Router();
  
app.post('/classified_chat', chatGPTController.getTemplate);
app.get('/chat_test', (req, res) => {
    res.send("Hello, this is a test to chat with API");
});
  
module.exports = app;