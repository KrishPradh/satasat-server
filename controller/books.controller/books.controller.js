// const Book = require('../../models/Books');
// // const jwt = require("jsonwebtoken"); 

// const createBook = async (req, res) => {
//     try {
//         const { title, author, genre, description, condition, bookPurpose,user } = req.body;

//         // Get token from Authorization header
//         // const token = req.headers.authorization?.split(' ')[1];
        
//         // if (!token) {
//         //     return res.status(401).json({ success: false, message: "No token provided" });
//         // }

//         // Verify token and get userId
//         // const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
//         // const userId = verifyToken.userId;
//         const bookImage = req.file; 

//         // Check if file was uploaded
//         if (!bookImage) {
//             return res.status(400).json({ success: false, message: "No image file provided" });
//         }

//         const token = req.cookies.token; // Read token from cookies

//         if (!token) {
//             return res.status(401).json({ success: false, message: 'Unauthorized' });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey');

//         // Fetch user details from the database
//         const userId = await UserModel.findById(decoded.id).select('-password'); // Exclude password from response

//         if (!userId) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }


//         const bookImagePath = bookImage.path;
//         // Create new book with user reference
//         const newBook = new Book({
//             title,
//             author,
//             genre,
//             description,
//             condition,
//             bookPurpose,
//             bookImage: bookImagePath,
//             user:userId._id,
//         });

//         await newBook.save();
//         res.status(201).json({ success: true, message: 'Book created successfully!', book: newBook });
//     } catch (error) {
//         console.error('Error creating book:', error);
//         res.status(500).json({ success: false, message: 'Failed to create book', error: error.message });
//     }
// };

// module.exports = { createBook };





// const jwt = require('jsonwebtoken');
// const UserModel = require('../../models/User');
// const Book = require('../../models/Books');
 

// const createBook = async (req, res) => {
//     try {
//         const { title, author, genre, location, description, condition, price, delivery, phoneNumber, bookPurpose } = req.body;

//         const bookImage = req.file; 
//         if (!bookImage) {
//             return res.status(400).json({ success: false, message: "No image file provided" });
//         }

//         const token = req.cookies.token; 
//         if (!token) {
//             return res.status(401).json({ success: false, message: 'Unauthorized' });
//         }

//         const imageUrl =

//         const decoded = jwt.verify(token, process.env.JWT_SECRET);
//         const user = await UserModel.findById(decoded.id).select('-password');

//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         const newBook = new Book({
//             title,
//             author,
//             genre,
//             description,
//             condition,
//             bookPurpose,
//             price,
//             phoneNumber,
//             location,
//             delivery,
//             bookImage: bookImage.path,
//             user: user._id,
//         });

//         await newBook.save();
//         res.status(201).json({ success: true, message: 'Book created successfully!', book: newBook });
//     } catch (error) {
//         console.error('Error creating book:', error);
//         res.status(500).json({ success: false, message: 'Failed to create book', error: error.message });
//     }
// };

// module.exports = createBook;










//--updated--
// const Book = require('../../models/Books');
// const jwt = require("jsonwebtoken");

// const createBook = async (req, res) => {
//     try {
//         const { title, author, genre, description, condition, bookPurpose } = req.body;

//         // Get token from Authorization header
//         const token = req.headers.authorization?.split(' ')[1];
        
//         if (!token) {
//             return res.status(401).json({ success: false, message: "No token provided" });
//         }

//         // Verify token and extract user ID
//         let userId;
//         try {
//             const verifyToken = jwt.verify(token, process.env.JWT_SECRET);
//             userId = verifyToken.userId;
//         } catch (err) {
//             return res.status(403).json({ success: false, message: "Invalid or expired token" });
//         }

//         const bookImage = req.file;

//         // Check if file was uploaded
//         if (!bookImage) {
//             return res.status(400).json({ success: false, message: "No image file provided" });
//         }

//         const bookImagePath = bookImage.path;

//         // Create new book with user reference
//         const newBook = new Book({
//             title,
//             author,
//             genre,
//             description,
//             condition,
//             bookPurpose,
//             bookImage: bookImagePath,
//             user: userId,
//         });

//         await newBook.save();
//         res.status(201).json({ success: true, message: 'Book created successfully!', book: newBook });
//     } catch (error) {
//         console.error('Error creating book:', error);
//         res.status(500).json({ success: false, message: 'Failed to create book', error: error.message });
//     }
// };

// module.exports = { createBook };




const jwt = require('jsonwebtoken');
const UserModel = require('../../models/User');
const Book = require('../../models/Books');
const { uploadFile } = require('../../Cloudinary/Cloudinary');

const createBook = async (req, res) => {
    try {
        const { title, author, genre, location, description, condition, price, delivery, phoneNumber, bookPurpose } = req.body;

        // When using upload.fields(), files are in req.files object
        // console.log('Files received:', req.files);
        
        if (!req.files || !req.files.bookImage) {
            return res.status(400).json({ success: false, message: "No book image provided" });
        }

        const bookImage = req.files.bookImage[0]; // Get the first file from bookImage field
        
        // Get the token from cookies
        const token = req.cookies.token; 
        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        // Decode the token and get user data
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await UserModel.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Upload the book image to Cloudinary
        const cloudinaryResult = await uploadFile(bookImage.path, "Books");

        // If the upload fails, return an error
        if (!cloudinaryResult) {
            return res.status(500).json({ success: false, message: 'Failed to upload image to Cloudinary' });
        }

        // Handle QR code image if provided
        let qrcodeImageUrl = "";
        if (req.files.qrcodeImage && req.files.qrcodeImage[0]) {
            const qrCodeImage = req.files.qrcodeImage[0];
            const qrResult = await uploadFile(qrCodeImage.path, "QRCode");
            if (!qrResult) {
                return res.status(500).json({ success: false, message: 'Failed to upload QR code image' });
            }
            qrcodeImageUrl = qrResult.secure_url;
        }

        // Create a new book with the image URL from Cloudinary
        const newBook = new Book({
            title,
            author,
            genre,
            description,
            condition,
            bookPurpose,
            price,
            phoneNumber,
            location,
            delivery,
            bookImage: cloudinaryResult.secure_url, // Store the Cloudinary URL
            qrcodeImage: qrcodeImageUrl,
            user: user._id,
        });

        // Save the book to the database
        await newBook.save();

        res.status(201).json({ success: true, message: 'Book created successfully!', book: newBook });
    } catch (error) {
        console.error('Error creating book:', error);
        res.status(500).json({ success: false, message: 'Failed to create book', error: error.message });
    }
};

module.exports = createBook;