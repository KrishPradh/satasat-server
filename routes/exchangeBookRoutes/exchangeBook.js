// // routes/exchangeRoutes.js
// const express = require('express');
// const bookExchangerouter = express.Router();
// const {getExchangeBooks} = require('../../controller/bookExchange.controller/bookExchange');

// bookExchangerouter.route("/get-exchange-books").get(getExchangeBooks)
// // router.post('/upload-exchangeBooks', exchangeController.createExchangeBook); // Create an exchange book

// module.exports = bookExchangerouter;



const express = require('express');
const router = express.Router();
const { getExchangeBooks } = require('../../controller/bookExchange.controller/bookExchange');

// Route to fetch exchange books
router.get('/get-exchange-books', getExchangeBooks);

// Export the router
module.exports = router;
