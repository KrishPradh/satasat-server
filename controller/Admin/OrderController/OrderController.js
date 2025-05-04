const dotenv = require("dotenv");
dotenv.config();
const fetch = require("node-fetch");
const Order = require('../../../models/Admin/order');
const Cart = require('../../../models/Cart');
const { createNotification } = require("../../Notification.controller/notfication.controller");
const AdminBook = require("../../../models/Admin/AdminBooks");
const { createAdminNotification } = require("../adminNotificationController/adminNotificationController");

exports.khaltiPay = async (req, res) => {
  const {
    purchaseOrderId,
    userId,
    totalAmount, // In paisa (frontend sends amount * 100)
    address,
    books, // Array of books from frontend
  } = req.body;

  if (!books || books.length === 0) {
    return res.status(400).json({ success: false, message: "No books provided." });
  }

  try {
    const amountInPaisa = parseInt(totalAmount);

    // Concatenate book info
    const bookTitles = books.map((b) => b.title).join(', ');
    const bookAuthors = books.map((b) => b.author).join(', ');
    const bookImages = books.map((b) => b.image || '').join(', ');
    const bookIds = books.map((b) => b.bookId); // for storing in DB

    const response = await fetch("https://a.khalti.com/api/v2/epayment/initiate/", {
      method: "POST",
      headers: {
        Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        return_url: "http://localhost:3000/khaltipay/successful",
        website_url: "http://localhost:3000/khaltipay/successful",
        amount: String(amountInPaisa),
        purchase_order_id: purchaseOrderId,
        purchase_order_name: bookTitles || "Books Purchase",
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      return res.status(400).json({
        success: false,
        message: errorData.detail || "Khalti error",
      });
    }

    const data = await response.json();

    const paymentMethod = "khalti"; 
    
    // Create new Order entry
    const newOrder = new Order({
      purchaseOrderId,
      pidx: data.pidx,
      userId,
      bookId: bookIds, // You can store this as an array in schema
      totalAmount: amountInPaisa,
      paymentMethod,
      paymentStatus: "pending",
      address,
      bookTitle: bookTitles,
      bookAuthor: bookAuthors,
      bookImage: bookImages,
      paymentUrl: data.payment_url,
    });

    await newOrder.save();

    for (const book of books) {
      const bookData = await AdminBook.findById(book.bookId).select("admin");
      // const normalizedMethod = paymentMethod?.toLowerCase(); 

      await createAdminNotification({
        adminId:bookData.admin ,
        bookBuyer: userId,
        type: "Khaltipurchase",
        bookId: book.bookId,
      });
    }

    return res.status(200).json({
      success: true,
      paymentUrl: data.payment_url,
      pidx: data.pidx,
      message: "Khalti payment initiated",
    });

  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Server error during payment",
    });
  }
};
  
exports.verifyKhaltiPayment = async (req, res) => {
    const { pidx } = req.body;
  
    if (!pidx) {
      return res.status(400).json({ success: false, message: "pidx is required" });
    }
  
    try {
      const verifyRes = await fetch("https://a.khalti.com/api/v2/epayment/lookup/", {
        method: "POST",
        headers: {
          Authorization: `Key ${process.env.KHALTI_SECRET_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ pidx }),
      });
  
      const result = await verifyRes.json();
  
      if (result.status === "Completed") {
        const updatedOrder = await Order.findOneAndUpdate(
          { pidx },
          { paymentStatus: "completed" },
          { new: true }
        );
  
        if (!updatedOrder) {
          return res.status(404).json({
            success: false,
            message: "Order not found for the provided pidx",
          });
        }
  
        // ✅ Clear cart after successful payment
        if (updatedOrder.userId) {
          await Cart.findOneAndUpdate(
            { userId: updatedOrder.userId },
            { books: [] }
          );
        }
  
        return res.status(200).json({
          success: true,
          message: "Payment verified and cart cleared successfully",
          order: updatedOrder,
        });
      } else {
        return res.status(400).json({
          success: false,
          message: "Payment not completed",
        });
      }
    } catch (err) {
      return res.status(500).json({
        success: false,
        message: err.message || "Server error during payment verification",
      });
    }
  };
