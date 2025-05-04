const Cart = require('../../models/Cart');
const AdminBook = require('../../models/Admin/AdminBooks'); // Optional, if you want to validate book exists
const mongoose = require("mongoose");

  exports.addToCart = async (req, res) => {
      const { bookId, quantity = 1 } = req.body;
    
      try {
        // Get userId from token in cookies
        const token = req.cookies.token;
        if (!token) {
          return res.status(401).json({ message: 'Authentication required. Please log in.' });
        }
    
        // Extract userId from token
        let userId;
        try {
          const jwt = require('jsonwebtoken');
          const decoded = jwt.verify(token, process.env.JWT_SECRET);
          userId = decoded.userId || decoded.id || decoded.sub;
          
          if (!userId) {
            return res.status(401).json({ message: 'User ID not found in token' });
          }
        } catch (tokenError) {
          return res.status(401).json({ message: 'Invalid or expired token' });
        }
    
        // Validate bookId
        if (!mongoose.Types.ObjectId.isValid(bookId)) {
          return res.status(400).json({ message: 'Invalid Book ID' });
        }
    
        // Check if the book exists
        const book = await AdminBook.findById(bookId);
        if (!book) {
          return res.status(404).json({ message: 'Book not found' });
        }
    
        // Check if the user already has a cart
        let cart = await Cart.findOne({ userId });
    
        if (!cart) {
          // If no cart exists, create a new cart
          cart = new Cart({
            userId,
            books: [{ bookId: new mongoose.Types.ObjectId(bookId), quantity }]
          });
        } else {
          // If cart exists, check if the book is already in the cart
          const bookInCart = cart.books.find(item => item.bookId.toString() === bookId);
    
          if (bookInCart) {
            // If the book is in the cart, update its quantity
            bookInCart.quantity += quantity;
          } else {
            // If the book is not in the cart, add it
            cart.books.push({ bookId: new mongoose.Types.ObjectId(bookId), quantity });
          }
        }
    
      //   console.log("Cart before saving:", cart); // Log cart state
        await cart.save();
        // console.log("Cart after saving:", await Cart.findById(cart._id)); // Log saved cart
    
        res.status(200).json({ message: 'Book added to cart successfully', cart });
    
      } catch (err) {
        console.error("Error in addToCart:", err);
        res.status(500).json({ message: 'Failed to add book to cart. Please try again.', error: err.message });
      }
    };


// Get Cart
exports.getCart = async (req, res) => {
  try {
    const token = req.cookies.token;

    if (!token) return res.status(401).json({ message: 'Login required' });

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id || decoded.sub;

    const cart = await Cart.findOne({ userId }).populate('books.bookId');
    if (!cart) return res.json({ books: [] });

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch cart', error: err.message });
  }
};


exports.getCartByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    const cart = await Cart.findOne({ userId })
      .populate('books.bookId'); // This fetches full book info from AdminBook

    if (!cart) {
      return res.status(404).json({ message: 'Cart not found' });
    }

    // Optional: Format cart with book details
    const populatedBooks = cart.books.map(item => ({
      ...item.bookId._doc,
      quantity: item.quantity,
    }));

    res.status(200).json({ cart: populatedBooks });
  } catch (error) {
    console.error('Error fetching cart:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

exports.removeFromCart = async (req, res) => {
  const { bookId } = req.params;

  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Login required' });

    const jwt = require('jsonwebtoken');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id || decoded.sub;

    const cart = await Cart.findOneAndUpdate(
      { userId },
      { $pull: { books: { bookId } } },
      { new: true }
    ).populate('books.bookId');

    res.json(cart);
  } catch (err) {
    res.status(500).json({ message: 'Error removing item', error: err.message });
  }
};



// exports.updateCartQuantity = async (req, res) => {
//   const { bookId } = req.params;
//   const { quantity } = req.body;

//   if (!quantity || quantity < 1) {
//     return res.status(400).json({ message: 'Quantity must be at least 1' });
//   }

//   try {
//     const token = req.cookies.token;
//     if (!token) return res.status(401).json({ message: 'Please log in' });

//     const jwt = require('jsonwebtoken');
//     const decoded = jwt.verify(token, process.env.JWT_SECRET);
//     const userId = decoded.userId || decoded.id || decoded.sub;

//     const bookObjectId = new mongoose.Types.ObjectId(bookId); 

//     const cart = await Cart.findOneAndUpdate(
//       { userId, 'books.bookId': bookObjectId },
//       { $set: { 'books.$.quantity': quantity } },
//       { new: true }
//     ).populate('books.bookId');

//     if (!cart) {
//       return res.status(404).json({ message: 'Book not found in cart' });
//     }

//     res.status(200).json({ cart });

//   } catch (err) {
//     console.error("Cart update error:", err);
//     res.status(500).json({ message: 'Failed to update cart' });
//   }
// };



const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose');
// const Cart = require('../models/Cart');

exports.updateCartQuantity = async (req, res) => {
  const { bookId, quantity } = req.body;

  if (!quantity || quantity < 1) {
    return res.status(400).json({ message: 'Quantity must be at least 1' });
  }

  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ message: 'Please log in' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.userId || decoded.id || decoded.sub;
    if (!userId) return res.status(401).json({ message: 'Invalid user' });

    const cart = await Cart.findOne({ userId });
    if (!cart) return res.status(404).json({ message: 'Cart not found' });

    const book = cart.books.find((item) => item.bookId.equals(bookId));
    if (!book) return res.status(404).json({ message: 'Book not in cart' });

    book.quantity = quantity;
    await cart.save();

    res.status(200).json({ cart });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update cart' });
  }
};


