const express = require('express');
const adminRouter = express.Router();
const { loginAdmin } = require('../../../controller/Admin/adminLogin/adminLogin');
const { registerAdmin } = require('../../../controller/Admin/adminLogin/adminLogin');

// Admin routes
adminRouter.post('/login', loginAdmin);
adminRouter.post('/register', registerAdmin);

module.exports = adminRouter;