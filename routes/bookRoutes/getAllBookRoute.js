const express = require("express")
const { getAllBooks, deleteBook } = require("../../controller/books.controller/getAllBooks.controller")

const getAllBookRouter = express.Router()

getAllBookRouter.route("/get-all-books").get(getAllBooks)
// getAllBookRouter.route("/delete").delete(deleteBook)
getAllBookRouter.delete('/deletebook/:id', deleteBook);

module.exports = getAllBookRouter