const express = require("express");
const multer = require("multer");
const path = require("path");
const {
  createRequest,
  getRequests,
  updateRequestStatus,
  getBookRequestById,
} = require("../../controller/ExchangeRequestController/ExchangeRequestController");

const ExchangeRequestRoutes = express.Router();

// Configure Multer for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads/"); // Ensure "uploads/" directory exists
  },
  filename: (req, file, cb) => {
    cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
  },
});

// File filter to allow only images (jpeg, jpg, png)
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png/;
  const isValidExt = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const isValidMime = allowedTypes.test(file.mimetype);

  if (isValidExt && isValidMime) {
    cb(null, true);
  } else {
    cb(new Error("Only JPEG, JPG, and PNG images are allowed!"), false);
  }
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // Limit file size to 5MB
});

// Route to create an exchange request (upload book images)
ExchangeRequestRoutes.post(
  "/create",
  upload.fields([
    { name: "senderBookImage", maxCount: 1 },
    { name: "receiverBookImage", maxCount: 1 },
  ]),
  async (req, res, next) => {
    try {
      console.log("Received Files:", req.files);
      console.log("Received Body:", req.body);

      // Call the createRequest controller function
      await createRequest(req, res);
    } catch (error) {
      console.error("Error handling request:", error);
      res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
  }
);

// Route to get exchange requests for a specific user
ExchangeRequestRoutes.get('/user', getRequests); 
ExchangeRequestRoutes.get('/:id', getBookRequestById);

// ExchangeRequestRoutes.post("/request", createRequest);

// Route to update (accept/decline) an exchange request
ExchangeRequestRoutes.put("/updatestatus", updateRequestStatus);

module.exports = ExchangeRequestRoutes;
