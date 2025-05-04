// const express = require('express');
// const multer = require('multer');
// const fs = require('fs');
// const createBook = require('../../controller/books.controller/books.controller');


// const bookRoute = express.Router();

// // Create uploads directory if it doesn't exist
// const uploadDir = './uploads/';
// if (!fs.existsSync(uploadDir)) {
//     fs.mkdirSync(uploadDir);
// }       

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         cb(null, uploadDir);
//     },
//     filename: (req, file, cb) => {
//         cb(null, `${Date.now()}-${file.originalname}`);
//     }
// });

// const upload = multer({
//     storage: storage,
//     // fileFilter: fileFilter,
//     limits: {
//         fileSize: 5 * 1024 * 1024 // 5MB limit
//     }
// });

// bookRoute.post('/upload', upload.single('bookImage'), createBook);

// module.exports = { bookRoute };


const express = require('express');
const multer = require('multer');
const fs = require('fs');
const createBook = require('../../controller/books.controller/books.controller');

const bookRoute = express.Router();

// Create uploads directory if it doesn't exist
const uploadDir = './uploads/';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// Configure multer for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Multer error handling middleware
const handleMulterError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        // A Multer error occurred when uploading
        return res.status(400).json({ success: false, message: `Upload error: ${err.message}` });
    } else if (err) {
        // An unknown error occurred
        return res.status(500).json({ success: false, message: `Server error: ${err.message}` });
    }
    next();
};

const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

// Accept both bookImage and qrcodeImage fields
const uploadFields = upload.fields([
    { name: 'bookImage', maxCount: 1 },
    { name: 'qrcodeImage', maxCount: 1 }
]);

bookRoute.post('/upload', uploadFields, handleMulterError, createBook);

module.exports = { bookRoute };