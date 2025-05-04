const jwt = require('jsonwebtoken');
const AdminModel = require('../../../models/Admin/Admin');
const AdminBook = require('../../../models/Admin/AdminBooks'); // Fixed the variable name from AdimBook
const { uploadFile } = require('../../../Cloudinary/Cloudinary');

const createAdminBook = async (req, res) => {
    try {
        const { title, author, genre, description, price, delivery, bookPurpose } = req.body;

        const bookImage = req.file; 
        if (!bookImage) {
            return res.status(400).json({ success: false, message: "No image file provided" });
        }

        // Get the token from cookies
        const token = req.cookies.token; 
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        // Decode the token and get admin data
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const admin = await AdminModel.findById(decoded.id).select('-password');

        if (!admin) {
            return res.status(404).json({ success: false, message: 'Admin not found' });
        }

        // Upload the image to Cloudinary
        const cloudinaryResult = await uploadFile(bookImage.path, "AdminBooks");

        // If the upload fails, return an error
        if (!cloudinaryResult) {
            return res.status(500).json({ success: false, message: 'Failed to upload image to Cloudinary' });
        }

        // Create a new book with the image URL from Cloudinary
        const newBook = new AdminBook({
            title,
            author,
            genre,
            description,
            bookPurpose,
            price,
            delivery,
            bookImage: cloudinaryResult.secure_url, // Store the Cloudinary URL
            admin: admin._id,
        });

        // Save the book to the database
        await newBook.save();

        res.status(201).json({ success: true, message: 'Book created successfully!', book: newBook });
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ success: false, message: 'Failed to create book', error: error.message });
    }
};

// const getAllAdminBooks = async (req, res) => {
//     try {
//         const books = await AdminBook.find({admin: admin._id})
        

//         if(!books){
//             return res.status(404).json({ message: 'books not available' });
//         }
//         res.status(200).json({message:'book exchange fetched',books});
//     } catch (error) {
//         console.error(error);
//         res.status(500).json({ error: 'Server error' });
//     }
// };


const getAllAdminBooks = async (req, res) => {
    try {
        // Fetch all admin books, optionally filter by purpose
        const books = await AdminBook.find({})
        const booksCount = books.length;

        if (!books.length) {
            return res.status(404).json({ success: false, message: 'No books found' });
        }

        res.status(200).json({
            success: true,
            message: 'Books fetched successfully',
            books,
            booksCount
        });
    } catch (error) {
        console.error('Error fetching admin books for users:', error);
        res.status(500).json({ success: false, message: 'Server error', error: error.message });
    }
};


module.exports = {
    createAdminBook,
    getAllAdminBooks
};
