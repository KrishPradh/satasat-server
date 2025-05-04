// exports.getUserOrderHistory = async (req, res) => {
//   const { userId } = req.params;

//   if (!userId) {
//     return res.status(400).json({
//       success: false,
//       message: "User ID is required",
//     });
//   }

//   try {
//     const orders = await Order.find({ userId })
//       .sort({ createdAt: -1 }) // newest first
//       .lean();

//     if (!orders || orders.length === 0) {
//       return res.status(200).json({
//         success: true,
//         message: "No orders found for this user",
//         orders: [],
//       });
//     }

//     return res.status(200).json({
//       success: true,
//       message: "Order history retrieved successfully",
//       orders,
//     });
//   } catch (err) {
//     console.error("Error fetching user order history:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Failed to fetch user order history",
//     });
//   }
// };

// controllers/orderController.js

// controllers/orderController.js
// const mongoose = require('mongoose');

// exports.getUserOrderHistory = async (req, res) => {
//   const { userId } = req.params;

//   // 1) Validate userId
//   if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
//     return res.status(400).json({
//       success: false,
//       message: 'A valid userId is required',
//     });
//   }

//   try {
//     // 2) Query & populate
//     const orders = await Order.find({ userId })
//       .sort({ createdAt: -1 })          // newest first
//       .populate({
//         path: 'bookId',                 // your array of ObjectIds
//         model: 'Book',                  // ensure this matches your Book model name
//       })
//       .lean();                          // plain JS objects

//     // 3) Return full order docs
//     return res.status(200).json({
//       success: true,
//       message: orders.length
//         ? 'Order history retrieved successfully'
//         : 'No orders found for this user',
//       orders,
//     });
//   } catch (err) {
//     console.error('Error fetching order history for user', userId, err);
//     return res.status(500).json({
//       success: false,
//       message: 'Server error while fetching order history',
//       error: err.message,
//     });
//   }
// };

// controllers/orderController.js
const mongoose = require("mongoose");
const Order = require("../../../models/Admin/order");
const { createAdminNotification } = require("../adminNotificationController/adminNotificationController");

exports.getUserOrderHistory = async (req, res) => {
  const { userId } = req.params;

  if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({
      success: false,
      message: "A valid userId is required",
    });
  }

  try {
    const orders = await Order.find({ userId })
      .sort({ createdAt: -1 })
      .populate("bookId") // ← populate the top‐level ref
      .lean();

    return res.status(200).json({
      success: true,
      message: orders.length
        ? "Order history retrieved successfully"
        : "No orders found for this user",
      orders,
    });
  } catch (err) {
    console.error("Error fetching order history:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching order history",
      error: err.message,
    });
  }
};

exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .sort({ createdAt: -1 })
      .populate("bookId") // populate the book details
      .populate("userId") // populate the user details
      .lean();

    return res.status(200).json({
      success: true,
      message: orders.length
        ? "All orders retrieved successfully"
        : "No orders found",
      orders,
    });
  } catch (err) {
    console.error("Error fetching all orders:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while fetching all orders",
      error: err.message,
    });
  }
};

// exports.updateOrderById = async (req, res) => {
//   try {
//     const { orderId, paymentStatus } = req.body;

//     if (!orderId) {
//       return res.status(400).json({
//         success: false,
//         message: "Order ID is required",
//       });
//     }

//     if (!paymentStatus) {
//       return res.status(400).json({
//         success: false,
//         message: "Payment status is required",
//       });
//     }

//     // Valid payment statuses - adjust these according to your application needs
//     const validStatuses = ["pending", "completed", "failed"];
//     if (!validStatuses.includes(paymentStatus)) {
//       return res.status(400).json({
//         success: false,
//         message: `Invalid payment status. Must be one of: ${validStatuses.join(
//           ", "
//         )}`,
//       });
//     }

//     const updatedOrder = await Order.findByIdAndUpdate(
//       orderId,
//       { paymentStatus },
//       { new: true, runValidators: true }
//     )
//       .populate("bookId")
//       .populate("userId")
//       .lean();

//       Order.paymentStatus = status;

//     if (!updatedOrder) {
//       return res.status(404).json({
//         success: false,
//         message: "Order not found",
//       });
//     }

//     await createAdminNotification({
//       adminId:bookData.admin ,
//       bookBuyer: userId,
//       type:  `COD_${status}`,
//       bookId: book.bookId,
//     });
  

//     return res.status(200).json({
//       success: true,
//       message: "Payment status updated successfully",
//       order: updatedOrder,
//     });
//   } catch (err) {
//     console.error("Error updating payment status:", err);
//     return res.status(500).json({
//       success: false,
//       message: "Server error while updating payment status",
//       error: err.message,
//     });
//   }
// };


exports.updateOrderById = async (req, res) => {
  try {
    const { orderId, paymentStatus } = req.body;

    if (!orderId) {
      return res.status(400).json({
        success: false,
        message: "Order ID is required",
      });
    }

    if (!paymentStatus) {
      return res.status(400).json({
        success: false,
        message: "Payment status is required",
      });
    }

    const validStatuses = ["pending", "completed", "failed"];
    if (!validStatuses.includes(paymentStatus)) {
      return res.status(400).json({
        success: false,
        message: `Invalid payment status. Must be one of: ${validStatuses.join(", ")}`,
      });
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      orderId,
      { paymentStatus },
      { new: true, runValidators: true }
    )
      .populate("bookId")
      .populate("userId")
      .lean();

    if (!updatedOrder) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    // Send notification to the user (book buyer)
    for (const book of updatedOrder.bookId || []) {
      await createAdminNotification({
        bookBuyer: updatedOrder.userId._id,
        type: `cod_${paymentStatus}`,
        bookId: book._id,
        message: `Your payment status for a book has been updated.`,
      });
    }

    return res.status(200).json({
      success: true,
      message: "Payment status updated successfully",
      order: updatedOrder,
    });
  } catch (err) {
    console.error("Error updating payment status:", err);
    return res.status(500).json({
      success: false,
      message: "Server error while updating payment status",
      error: err.message,
    });
  }
};
