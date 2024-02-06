const { Router } = require('express');
const accidentDetailsController = require('../controllers/AccidentDetailsController');

const app = Router();
app.post('/accidentDetails/retrievalContent', accidentDetailsController.retrievalContent);


module.exports = app;




