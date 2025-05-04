const express = require('express');
const { getBookById, getBookadminbyId } = require('../../controller/singleBook.controler/singleBook');

const singleBookrouter = express.Router();

// Route to get a single book by ID
// router.get('/:id', getBookById);
singleBookrouter.route("/get-single-books/:bookId").get(getBookById)
singleBookrouter.route("/get-singleadminbooks/:bookId").get(getBookadminbyId)

module.exports = singleBookrouter;
