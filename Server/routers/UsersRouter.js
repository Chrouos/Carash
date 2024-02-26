
const { Router } = require('express');
const usersController = require('../controllers/UsersController');

const app = Router();
app.post('/api/users/registerAccount', usersController.registerAccount);
app.post('/api/users/loginAccount', usersController.loginAccount);

module.exports = app;





