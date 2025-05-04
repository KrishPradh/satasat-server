const express = require('express');
const BuySellRequestrouter = express.Router();
const {
  createBuySellRequest,
  getBuySellRequests
} = require('../../controller/BuySellRequestController/BuySellRequestController');

// POST: Create a new Buy/Sell request
BuySellRequestrouter.post('/createreq', createBuySellRequest);

// GET: Get all requests for a specific book by ID
BuySellRequestrouter.get('/book/:bookId', getBuySellRequests);

module.exports = BuySellRequestrouter;
