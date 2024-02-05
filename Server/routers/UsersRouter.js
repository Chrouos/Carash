
const { Router } = require('express');
const usersController = require('../controllers/UsersController');

const app = Router();
app.post('/users/registerAccount', usersController.registerAccount);
app.post('/users/loginAccount', usersController.loginAccount);

module.exports = app;





