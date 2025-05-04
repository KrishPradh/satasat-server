const Order = require("../../../models/Admin/order");
const mongoose = require("mongoose");
// const User = require('../../../models/User')
const Cart = require("../../../models/Cart");
const AdminModel = require("../../../models/Admin/Admin");
const {
  createAdminNotification,
} = require("../adminNotificationController/adminNotificationController");
const AdminBook = require("../../../models/Admin/AdminBooks");

const createOrder = async (req, res) => {
  try {
    const { userId, totalAmount, address, books} = req.body;

    // Check if all required fields are present
    if (!userId || !totalAmount || !address || !books || books.length === 0) {
      // console.error('Missing required fields', req.body);  // Log for debugging
      return res.status(400).json({ message: "All fields are required" });
    }

    // Extract values for bookId, bookTitle, bookAuthor, bookImage
    // const bookId = books.map((b) => b.bookId);
    // const bookTitle = books.map((b) => b.title)[0];
    // const bookAuthor = books.map((b) => b.author)[0];
    // const bookImage = books.map((b) => b.image || "")[0];

    const bookTitles = books.map((b) => b.title).join(', ');
    const bookAuthors = books.map((b) => b.author).join(', ');
    const bookImages = books.map((b) => b.image || '').join(', ');
    const bookIds = books.map((b) => b.bookId);

    const purchaseOrderId = `ORD-${Date.now()}`;
    const pidx = new mongoose.Types.ObjectId().toString();

    const paymentMethod = "cod";

    // Create new order object
    const newOrder = new Order({
      purchaseOrderId,
      pidx,
      userId,
      bookId:bookIds,
      bookTitle:bookTitles,
      bookAuthor:bookAuthors,
      bookImage:bookImages,
      totalAmount,
      paymentMethod,
      paymentStatus: "pending",
      address,
    });

    // console.log(userId)

    // Save the order to the database
    const savedOrder = await newOrder.save();

    await Cart.deleteOne({ userId });

    for (const book of books) {
      const bookData = await AdminBook.findById(book.bookId).select("admin");

      // const normalizedMethod = paymentMethod?.toLowerCase(); 

      await createAdminNotification({
        adminId:bookData.admin ,
        bookBuyer: userId,
        type:  "Codpurchase",
        bookId: book.bookId,
      });
    }

    // Return success response
    return res.status(201).json({
      success: true,
      message: "Order created successfully",
      order: savedOrder,
    });
  } catch (error) {
    console.error("Error creating order:", error); // Log the actual error for debugging
    return res.status(500).json({ message: "Internal server error" });
  }
};

// Update the payment status for COD orders
// const updateCODPaymentStatus = async (req, res) => {
//   try {
//     const { purchaseOrderId } = req.params;
//     const { paymentStatus } = req.body; // e.g., 'completed' or 'failed'

//     // Check if the payment status is valid
//     if (!['completed', 'failed'].includes(paymentStatus)) {
//       return res.status(400).json({ message: 'Invalid payment status' });
//     }

//     // Find the order by purchaseOrderId
//     const order = await Order.findOne({ purchaseOrderId });
//     if (!order) {
//       return res.status(404).json({ message: 'Order not found' });
//     }

//     // Update the payment status
//     order.paymentStatus = paymentStatus;
//     order.updatedAt = Date.now();

//     // Save the updated order
//     const updatedOrder = await order.save();

//     return res.status(200).json({
//       message: `Payment status updated to ${paymentStatus}`,
//       order: updatedOrder,
//     });
//   } catch (error) {
//     console.error('Error updating payment status:', error);
//     return res.status(500).json({ message: 'Internal server error' });
//   }
// };

module.exports = { createOrder };
