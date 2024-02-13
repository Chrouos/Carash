const { Router } = require('express');
const accidentDetailsController = require('../controllers/AccidentDetailsController');

const app = Router();
app.post('/accidentDetails/retrievalContent', accidentDetailsController.retrievalContent);
app.post('/accidentDetails/getAccidentDetailsTitle', accidentDetailsController.getAccidentDetailsTitle);
app.post('/accidentDetails/getContentAndJson', accidentDetailsController.getContentAndJson);
app.post('/accidentDetails/refactorEvent', accidentDetailsController.refactorEvent);
app.post('/accidentDetails/litigantAgent', accidentDetailsController.litigantAgent);

module.exports = app;




