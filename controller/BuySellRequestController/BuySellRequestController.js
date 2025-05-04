const jwt = require('jsonwebtoken');
const Book = require('../../models/Books');
const BuySell = require('../../models/BuySellRequest');
const mongoose = require('mongoose');
const { createNotification } = require('../Notification.controller/notfication.controller');

// POST /api/buy
exports.createBuySellRequest = async (req, res) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey');
    const buyerId = decoded.id;

    const { bookId, price, phoneNumber, location } = req.body;

    const book = await Book.findById(bookId);
    if (!book) return res.status(404).json({ message: 'Book not found' });

    const newRequest = new BuySell({
      buyer: buyerId,
      seller: book.user,
      bookId,
      price,
      subtotal: price,
      totalAmount: price,
      phoneNumber,
      location,
    });

    await newRequest.save();

    await createNotification({
      userId: book.user,           // the seller who should receive the notification
      bookOwner: buyerId,          // the one who bought the book
      type: "purchase",           
      bookId: bookId,
    });

    return res.status(201).json({ message: 'Buy/Sell request created', request: newRequest });
  } catch (error) {
    console.error("Error creating buy/sell request:", error);
    return res.status(500).json({ message: "Something went wrong" });
  }
};

// GET /api/buy/book/:bookId
// exports.getBuySellRequests = async (req, res) => {
//   try {
//     const { bookId } = req.params;

//     // Validate bookId format
//     if (!mongoose.Types.ObjectId.isValid(bookId)) {
//       return res.status(400).json({ message: "Invalid book ID." });
//     }

//     // Query BuySell model to find requests for a specific book
//     const requests = await BuySell.find({ bookId })
//       .populate('buyer', 'name email')
//       .populate('seller', 'name email')
//       .populate('bookId', 'title price bookImage')
//       .sort({ createdAt: -1 })
//       .exec();

//     if (requests.length === 0) {
//       return res.status(404).json({ message: "No requests found for this book." });
//     }

//     return res.status(200).json({ requests });
//   } catch (error) {
//     console.error("Error fetching buy/sell requests:", error);
//     return res.status(500).json({ message: "Something went wrong. Please try again." });
//   }
// };


exports.getBuySellRequests = async (req, res) => {
  try {
    const { bookId } = req.params;

    // Validate bookId format
    if (!mongoose.Types.ObjectId.isValid(bookId)) {
      return res.status(400).json({ message: "Invalid book ID." });
    }

    // First, get the book details
    const book = await Book.findById(bookId);
    
    if (!book) {
      return res.status(404).json({ message: "Book not found." });
    }

    return res.status(200).json({ book });
  } catch (error) {
    console.error("Error fetching book details:", error);
    return res.status(500).json({ message: "Something went wrong. Please try again." });
  }
};