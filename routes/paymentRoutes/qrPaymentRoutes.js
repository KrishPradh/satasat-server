const express = require('express');
const   qrPaymentRouter = express.Router();
const multer = require('multer');
const { createQrPayment, getQrPaymentsByUser, updateQrPaymentStatus } = require('../../controller/Payment/QrPayment');
// Configure multer for disk storage
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads/'); // Ensure this directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  }
});

const upload = multer({ storage });

// Use multer middleware to process the file upload
qrPaymentRouter.post('/qr', upload.single('paymentSlip'), createQrPayment);
qrPaymentRouter.get('/getqrpayment/:userId', getQrPaymentsByUser);
qrPaymentRouter.patch('/qr/:paymentId/status', updateQrPaymentStatus);

module.exports = qrPaymentRouter;