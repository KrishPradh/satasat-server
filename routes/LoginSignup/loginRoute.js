// const express = require('express');
// const { loginUser } = require('../../controller/LoginSignup/login.controller');
// const { getUser, uploadQRCode } = require('../../controller/LoginSignup/getUser.controller');
// const multer = require('multer');

// // Configure multer for file uploads
// const storage = multer.diskStorage({
//     destination: function (req, file, cb) {
//       cb(null, 'uploads/') // Make sure this directory exists
//     },
//     filename: function (req, file, cb) {
//       cb(null, Date.now() + '-' + file.originalname)
//     }
//   });
  
//   const upload = multer({ storage: storage });

// const loginRoute = express.Router();

// // Define the POST route for login
// loginRoute.post('/Login', loginUser);
// loginRoute.get('/user', getUser);
// loginRoute.post('/user/uploadqr', upload.single('qrCode'), uploadQRCode);

// module.exports = { loginRoute };


const express = require('express');
// const multer = require('multer');
// const path = require('path');
const { loginUser } = require('../../controller/LoginSignup/login.controller');
const { getUser, uploadQRCode, getQRCode, getQRCodebyid } = require('../../controller/LoginSignup/getUser.controller');

// Configure multer for temporary file storage before uploading to Cloudinary
// const storage = multer.diskStorage({
//   destination: function (req, file, cb) {
//     cb(null, 'uploads/') // Temporary storage directory
//   },
//   filename: function (req, file, cb) {
//     cb(null, Date.now() + '-' + file.originalname)
//   }
// });

// // File filter to ensure only images are uploaded
// const fileFilter = (req, file, cb) => {
//   const allowedFileTypes = /jpeg|jpg|png|gif/;
//   const extname = allowedFileTypes.test(path.extname(file.originalname).toLowerCase());
//   const mimetype = allowedFileTypes.test(file.mimetype);
  
//   if (extname && mimetype) {
//     return cb(null, true);
//   } else {
//     cb(new Error('Only image files are allowed!'));
//   }
// };

// // Initialize multer with storage and file filter
// const upload = multer({ 
//   storage: storage,
//   fileFilter: fileFilter,
//   limits: {
//     fileSize: 5 * 1024 * 1024 // Limit file size to 5MB
//   }
// });

const loginRoute = express.Router();

// Define routes
loginRoute.post('/Login', loginUser);
loginRoute.get('/user', getUser);
// loginRoute.get('/payment/getqr', getQRCodebyid);

// QR code upload route with multer middleware
// loginRoute.post('/user/uploadqr', upload.single('qrCode'), uploadQRCode);

module.exports = { loginRoute };