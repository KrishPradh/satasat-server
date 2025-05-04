const express = require("express")
const codRouter = express.Router();
const { CODPayment,  getCODPaymentsByUser, verifyPayment } = require('../../controller/Payment/codPayment');

// COD Payment Routes
codRouter.post('/create/cod', CODPayment);
codRouter.get('/get/cod/:userId', getCODPaymentsByUser);
codRouter.patch('/cod/verification/:paymentId', verifyPayment);

module.exports = codRouter;