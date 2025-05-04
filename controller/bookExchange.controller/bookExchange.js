// controllers/exchangeController.js
// -updated-
// const Book = require('../../models/Books');

// exports.getExchangeBooks = async (req, res) => {
//     try {
//         const books = await Book.find({ bookPurpose: 'Exchange' });
        

//         if(!books){
//             return res.status(404).json({ message: 'books not available' });
//         }
//         res.status(200).json({message:'book exchange fetched',books});
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// };



// updated--
const Book = require('../../models/Books');

exports.getExchangeBooks = async (req, res) => {
    try {
        const books = await Book.find({ bookPurpose: 'Exchange' }).populate("user","name");

        // Check if books array is empty instead of checking for null
        if (books.length === 0) {
            return res.status(404).json({ message: 'No books available for exchange' });
        }

        res.status(200).json({ message: 'Book exchange list fetched successfully', books });
    } catch (error) {
        console.error("Error fetching exchange books:", error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
};


// exports.createExchangeBook = async (req, res) => {
//     const { title, author, description, condition, genre } = req.body;

//     if (!title || !author || !genre || !description || !condition) {
//         return res.status(400).json({ error: 'All required fields must be provided' });
//     }

//     try {
//         const newBook = new Book({
//             title,
//             author,
//             condition,
//             description,
//             genre,
//             bookPurpose: 'Exchange',
//         });

//         await newBook.save();
//         res.status(201).json({ message: 'Exchange book created successfully', book: newBook });
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// };
