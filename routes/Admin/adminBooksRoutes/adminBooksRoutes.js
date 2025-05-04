const express = require('express');
const multer = require('multer');
const fs = require('fs');
const { createAdminBook, getAllAdminBooks } = require('../../../controller/Admin/adminBookcontroller/adminBook.controller');


const adminbookRoute = express.Router();

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

// const fileFilter = (req, file, cb) => {
//     const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
//     if (allowedTypes.includes(file.mimetype)) {
//         cb(null, true);
//     } else {
//         cb(new Error('Invalid file type. Only JPEG, PNG and GIF are allowed.'), false);
//     }
// };

const upload = multer({
    storage: storage,
    // fileFilter: fileFilter,
    limits: {
        fileSize: 5 * 1024 * 1024 // 5MB limit
    }
});

adminbookRoute.post('/book/post', upload.single('bookImage'), createAdminBook);
adminbookRoute.get('/book/getpost', getAllAdminBooks);

module.exports = { adminbookRoute };