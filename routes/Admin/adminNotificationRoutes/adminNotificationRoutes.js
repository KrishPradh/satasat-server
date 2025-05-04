// routes/notificationRoutes.js
const express = require('express');
const { createAdminNotification, getAllAdminNotifications } = require('../../../controller/Admin/adminNotificationController/adminNotificationController');
const adminNotificationRouter = express.Router();
// const { createAdminNotification, getUserAdminNotifications } = require('../../../controller/Admin/adminNotificationController/adminNotificationController');
// const createNotification = require('../../controller/Notification.controller/notfication.controller');

// POST /api/notifications
adminNotificationRouter.post('/createnoti', createAdminNotification);
adminNotificationRouter.get('/notification/getallnoti', getAllAdminNotifications);

module.exports = adminNotificationRouter;
