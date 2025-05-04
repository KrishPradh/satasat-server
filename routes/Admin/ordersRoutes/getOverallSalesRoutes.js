const express = require('express');
const { getOverallSales } = require('../../../controller/Admin/OrderController/getTotalSales');
const totalSalesRouter = express.Router();
// const { getOverallSales } = require('../controllers/adminController');

// Optional: Add isAdmin middleware
totalSalesRouter.get('/overall-sales', getOverallSales);

module.exports = totalSalesRouter;