const express = require('express');
const { getAdimBookById } = require('../../../controller/Admin/getSingleAdminBook/getSingleAdminBook');

const singleAdminBookrouter = express.Router();

// Route to get a single book by ID
// router.get('/:id', getBookById);
singleAdminBookrouter.route("/getAdminSingleBooks/:bookId").get(getAdimBookById)

module.exports = singleAdminBookrouter;
