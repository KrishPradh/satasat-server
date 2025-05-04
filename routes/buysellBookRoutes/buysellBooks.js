const express = require('express');
const bookBuySellrouter = express.Router();
const {getBuySellBooks} = require('../../controller/bookBuySell.controller/bookBuySell.controler');

bookBuySellrouter.route("/get-buysell-books").get(getBuySellBooks)
module.exports = bookBuySellrouter;