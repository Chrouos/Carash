const { Router } = require('express');
const pythonController = require('../controllers/PythonController')

const app = Router();
  
app.post('/python/predictor_money', pythonController.predictor_money);


module.exports = app;