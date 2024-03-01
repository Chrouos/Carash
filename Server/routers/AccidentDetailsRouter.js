const { Router } = require('express');
const accidentDetailsController = require('../controllers/AccidentDetailsController');

const app = Router();
app.post('/api/accidentDetails/retrievalContent', accidentDetailsController.retrievalContent);
app.post('/api/accidentDetails/getAccidentDetailsTitle', accidentDetailsController.getAccidentDetailsTitle);
app.post('/api/accidentDetails/getContentAndJson', accidentDetailsController.getContentAndJson);
app.post('/api/accidentDetails/refactorEvent', accidentDetailsController.refactorEvent);
app.post('/api/accidentDetails/litigantAgent', accidentDetailsController.litigantAgent);
app.post('/api/accidentDetails/updateViewerData', accidentDetailsController.updateViewerData);

module.exports = app;




