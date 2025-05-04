const Book = require('../../models/Books');
const AdminBook = require('../../models/Admin/AdminBooks') // Replace with your actual model path

// Controller to get a single book description by ID
const getBookById = async (req, res) => {
    try {
        const bookId = req.params.bookId;

        
        // Find the book by ID
        const book = await Book.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Return the book data
        res.status(200).json(book);
    } catch (error) {
        console.error('Couldnt fetch book description', error);
        res.status(500).json({ message: 'Server error' });
    }
};

const getBookadminbyId = async (req, res) => {
    try {
        const bookId = req.params.bookId;

        
        // Find the book by ID
        const book = await AdminBook.findById(bookId);

        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        // Return the book data
        res.status(200).json(book);
    } catch (error) {
        console.error('Couldnt fetch book description', error);
        res.status(500).json({ message: 'Server error' });
    }
};

module.exports = {
    getBookById,
    getBookadminbyId
};
