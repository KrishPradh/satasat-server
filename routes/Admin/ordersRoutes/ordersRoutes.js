const express = require('express');
const orderRouter = express.Router();
const { khaltiPay, verifyKhaltiPayment } = require('../../../controller/Admin/OrderController/OrderController');  // Import your order controller

// Route to initiate Khalti payment
orderRouter.post("/khalti/initiate", khaltiPay);
orderRouter.post("/khalti/verify", verifyKhaltiPayment);


module.exports = orderRouter;
