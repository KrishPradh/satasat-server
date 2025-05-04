// routes/notificationRoutes.js
const express = require('express');
const notificationRouter = express.Router();
const { getUserNotifications, createNotification } = require('../../controller/Notification.controller/notfication.controller');
// const createNotification = require('../../controller/Notification.controller/notfication.controller');

// POST /api/notifications
notificationRouter.post('/create', createNotification);
notificationRouter.get('/getnoti/:userId', getUserNotifications);

module.exports = notificationRouter;
