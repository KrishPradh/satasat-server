// routes/orderRoutes.js
const express = require("express");
const orderHistoryRouter = express.Router();
const { getUserOrderHistory, getAllOrders, updateOrderById } = require("../../../controller/Admin/Orderhistory/Orderhistory");

orderHistoryRouter.get("/history/:userId", getUserOrderHistory);
orderHistoryRouter.get("/getallhistory", getAllOrders);
orderHistoryRouter.patch("/updateorder/", updateOrderById);


module.exports = orderHistoryRouter;
