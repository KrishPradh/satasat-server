// controllers/codController.js
// const Payment = require('../../models/Payment');
// const Book = require('../../models/Books');
// const User = require('../../models/User');

// // Create a new COD payment
// exports.createCODPayment = async (req, res) => {
//   try {
//     const { buyerId, sellerId, bookId, amount, mobile, shippingAddress } = req.body;

//     // Validate required fields
//     if (!buyerId || !sellerId || !amount || !mobile) {
//       return res.status(400).json({
//         success: false,
//         message: 'Required fields missing: buyerId, sellerId, amount, and mobile are required'
//       });
//     }

//     // Verify that buyer and seller exist
//     const [buyer, seller] = await Promise.all([
//       User.findById(buyerId),
//       User.findById(sellerId)
//     ]);

//     if (!buyer || !seller) {
//       return res.status(404).json({
//         success: false,
//         message: !buyer ? 'Buyer not found' : 'Seller not found'
//       });
//     }

//     // Verify book if provided
//     if (bookId) {
//       const book = await Book.findById(bookId);
//       if (!book) {
//         return res.status(404).json({ success: false, message: 'Book not found' });
//       }
//     }

//     // Create COD payment
//     const newPayment = new Payment({
//       buyerId,
//       sellerId,
//       bookId: bookId || null,
//       transactionId: `COD-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
//       amount,
//       status: 'pending',
//       mobile,
//       payload: {
//         type: 'COD',
//         shippingAddress,
//         paymentMethod: 'Cash on Delivery',
//         orderDate: new Date()
//       }
//     });

//     const savedPayment = await newPayment.save();

//     // Update book status if applicable
//     if (bookId) {
//       await Book.findByIdAndUpdate(bookId, {
//         isAvailable: false,
//         status: 'pending-delivery'
//       });
//     }

//     return res.status(201).json({
//       success: true,
//       message: 'COD order placed successfully',
//       payment: savedPayment
//     });
//   } catch (error) {
//     console.error('COD Payment Error:', error);
//     return res.status(500).json({
//       success: false,
//       message: 'Error processing COD payment',
//       error: error.message
//     });
//   }
// };

const Payment = require("../../models/Payment"); // adjust path if needed
const { createNotification } = require("../Notification.controller/notfication.controller");

// Utility to generate custom transaction ID for COD
function generateCODTransactionId() {
  const timestamp = Date.now();
  const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
  return `COD-${timestamp}-${randomStr}`;
}

// Controller to handle COD payment
exports.CODPayment = async (req, res) => {
  try {
    const { buyerId, sellerId, bookId, amount, mobile, shippingAddress } =
      req.body;

    // Validate required fields
    if (!buyerId || !sellerId || !amount || !mobile || !shippingAddress) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    const newPayment = new Payment({
      buyerId,
      sellerId,
      bookId,
      amount,
      mobile,
      shippingAddress,
      paymentMethod: "cod",
      transactionId: generateCODTransactionId(),
      status: "pending", // you can change this to 'completed' after delivery
    });

    const savedPayment = await newPayment.save();

    await createNotification({
      userId: sellerId,    
      bookOwner: buyerId,  
      type: 'Codpurchase',    
      bookId: bookId,      
    });

    res.status(201).json({
      success: true,
      // message: "COD payment recorded successfully.",
      payment: savedPayment,
    });
  } catch (err) {
    console.error("Error in COD payment:", err);
    res
      .status(500)
      .json({ message: "Server error while processing COD payment." });
  }
};

// Get all COD payments made by a specific buyer
// exports.getCODByUser = async (req, res) => {
//   try {
//     const { userId } = req.params;

//     if (!userId) {
//       return res.status(400).json({ message: 'User ID is required.' });
//     }

//     const codPayments = await Payment.find({
//       buyerId: userId,
//       paymentMethod: 'cod'
//     }).populate('bookId sellerId buyerId');

//     res.status(200).json({
//       message: 'COD payments fetched successfully.',
//       payments: codPayments
//     });
//   } catch (err) {
//     console.error('Error fetching COD payments:', err);
//     res.status(500).json({ message: 'Server error while fetching COD payments.' });
//   }
// };

exports.getCODPaymentsByUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res
        .status(400)
        .json({ success: false, message: "User ID is required." });
    }

    const payments = await Payment.find({
      paymentMethod: "cod",
      $or: [{ buyerId: userId }, { sellerId: userId }],
    })
      .populate("bookId", "title author price bookImage")
      .populate("buyerId", "name email")
      .populate("sellerId", "name email")
      .sort({ createdAt: -1 });

    return res.status(200).json({
      success: true,
      message: "COD payments fetched successfully.",
      payments,
    });
  } catch (err) {
    console.error("Get COD payments error:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching COD payments.",
      error: err.message,
    });
  }
};


// exports.verifyPayment = async (req, res) => {
//   try {
//     const { paymentId } = req.params;
//     const { verificationStatus } = req.body;

//     if (!paymentId) {
//       return res.status(400).json({ success: false, message: 'Payment ID is required.' });
//     }

//     if (!verificationStatus || !['accepted', 'rejected'].includes(verificationStatus)) {
//       return res.status(400).json({
//         success: false,
//         message: 'Valid verification status (accepted/rejected) is required.'
//       });
//     }

//     const payment = await Payment.findById(paymentId);

//     if (!payment) {
//       return res.status(404).json({ success: false, message: 'Payment not found.' });
//     }

//     // Update the payment verification status
//     payment.verificationStatus = verificationStatus;
//     payment.verificationDate = new Date();
//     await payment.save();

//     // If you need to update the related order as well
//     if (payment.orderId) {
//       const orderStatus = verificationStatus === 'accepted' ? 'completed' : 'cancelled';
//       await Order.findByIdAndUpdate(payment.orderId, { status: orderStatus });
//     }

//     return res.status(200).json({
//       success: true,
//       message: `Payment ${verificationStatus} successfully.`,
//       payment
//     });

//   } catch (err) {
//     console.error('Payment verification error:', err);
//     res.status(500).json({
//       success: false,
//       message: 'Server error while verifying payment.',
//       error: err.message
//     });
//   }
// };

exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const { status } = req.body;

    if (!paymentId) {
      return res.status(400).json({ success: false, message: 'Payment ID is required.' });
    }

    if (!status || !['completed', 'failed'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Valid status (completed/failed) is required.'
      });
    }

    const payment = await Payment.findById(paymentId);

    if (!payment) {
      return res.status(404).json({ success: false, message: 'Payment not found.' });
    }
     
    const { sellerId, buyerId, bookId } = payment;
     
    // Update the payment status
    payment.status = status;
    payment.updatedAt = new Date(); // optional: to track update time
    await payment.save();

    await createNotification({
      userId: buyerId,    
      bookOwner: sellerId,  
      type: 'Codpaid',    
      bookId: bookId,      
    });

    return res.status(200).json({
      success: true,
      message: `Payment status updated to '${status}' successfully.`,
      payment
    });

  } catch (err) {
    console.error('Payment verification error:', err);
    res.status(500).json({
      success: false,
      message: 'Server error while verifying payment.',
      error: err.message
    });
  }
};
