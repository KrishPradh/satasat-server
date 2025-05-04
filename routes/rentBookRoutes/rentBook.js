
const express = require('express');
const bookRentrouter = express.Router();
const {getRentBooks} = require('../../controller/bookRent.controller/bookRent.controller');

bookRentrouter.route("/get-rent-books").get(getRentBooks)
module.exports = bookRentrouter;