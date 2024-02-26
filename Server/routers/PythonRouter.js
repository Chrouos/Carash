const { Router } = require('express');
const pythonController = require('../controllers/PythonController')

const app = Router();
app.post('/api/python/predictor_money', pythonController.predictor_money);
app.post('/api/python/save_predictor_file', pythonController.save_predictor_file);


module.exports = app;