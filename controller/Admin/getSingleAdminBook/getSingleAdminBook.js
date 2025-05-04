const Book = require('../../../models/Books'); // Replace with your actual model path

// Controller to get a single book description by ID
// const getAdimBookById = async (req, res) => {
//     try {
//         const bookId = req.params.bookId;

        
//         // Find the book by ID
//         const book = await AdminBook.findById(bookId);

//         if (!book) {
//             return res.status(404).json({ message: 'Book not found' });
//         }

//         // Return the book data
//         res.status(200).json(book);
//     } catch (error) {
//         console.error('Couldnt fetch book description', error);
//         res.status(500).json({ message: 'Server error' });
//     }
// };

const mongoose = require('mongoose'); // Make sure this is imported

const getAdimBookById = async (req, res) => {
    try {
        const bookId = req.params.bookId;
        // console.log('Fetching book with ID:', bookId); // ADD THIS

        if (!bookId || !mongoose.Types.ObjectId.isValid(bookId)) {
            return res.status(400).json({ message: 'Invalid book ID' });
        }

        const book = await Book.findById(bookId);
        if (!book) {
            return res.status(404).json({ message: 'Book not found' });
        }

        res.status(200).json(book);
    } catch (error) {
        console.error('Couldn\'t fetch book description', error);
        res.status(500).json({ message: 'Server error' });
    }
};



module.exports = {
    getAdimBookById
};
