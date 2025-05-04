const express = require('express');
const codadminRouter = express.Router();
const { createOrder} = require('../../../controller/Admin/OrderController/CodOrderController');

// Create a new order with COD payment
codadminRouter.post('/codorders', createOrder);

// Update the payment status of an order (COD)
// router.patch('/orders/:purchaseOrderId/payment-status', updateCODPaymentStatus);

module.exports = codadminRouter;
