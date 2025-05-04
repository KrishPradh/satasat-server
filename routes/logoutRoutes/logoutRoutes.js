const express = require('express');
const { logoutUser } = require('../../controller/logoutController/logoutController');
const logoutRouter = express.Router();

logoutRouter.post('/logout', logoutUser);

module.exports = logoutRouter;

