const Notification = require("../../../models/Admin/adminNotification");
const AdminBook = require("../../../models/Admin/AdminBooks");
const UserModel = require("../../../models/User");

exports.createAdminNotification = async ({ adminId, bookBuyer, type, bookId }) => {
  try {
    // if (!adminId) {
    //   throw new Error("Missing adminId while creating admin notification");
    // }
    if (!bookBuyer) {
      throw new Error("Missing bookBuyer while creating admin notification");
    }

    // console.log("bookBuyer ID:", bookBuyer);

    let message = "You have a new admin notification.";

    const buyer = await UserModel.findById(bookBuyer).select("name"); // or "name" based on your User model
    const buyerName = buyer?.name || "A user";

    if (bookId) {
      const book = await AdminBook.findById(bookId).select("title");
      if (!book) {
        console.warn("Book not found with bookId:", bookId);
      }
      const bookTitle = book?.title || "a book";

      switch (type) {
        case "Codpurchase":
          message = `A new Cash on Delivery purchase request has been made for "${bookTitle}" by ${buyerName}.`;
          break;
        case "Khaltipurchase":
          message = `A Khalti payment has been made for "${bookTitle}" by ${buyerName}.`;
          break;
        case "cod_completed":
          message = `Your COD payment has been confirmed for "${bookTitle}".`;
          break;
        case "cod_failed":
          message = `Your COD request has been declined for "${bookTitle}".`;
          break;
        default:
          console.warn("Notification type did not match predefined types.");
      }
    } else {
      // Generic messages if no bookId is provided
      switch (type) {
        case "Codpurchase":
          message = `A new Cash on Delivery purchase request has been made.`;
          break;
        case "Khaltipurchase":
          message = `A Khalti payment has been made.`;
          break;
        case "cod_paid":
          message = `COD payment has been confirmed.`;
          break;
        case "cod_declined":
          message = `COD request has been declined.`;
          break;
      }
    }

    const notification = await Notification.create({
      adminId:adminId,        // who should see this notification
      bookBuyer,              // who owns the book
      type,
      bookId: bookId || null,
      message,
      isRead: false,
    });

    return notification;
  } catch (error) {
    console.error("Error creating admin notification:", error.message);
    return null;
  }
};

exports.getAllAdminNotifications = async (req, res) => {
  try {
    const { adminId } = req.query; // Optional filter

    let query = {};
    if (adminId) {
      query.userId = adminId;
    }

    const notifications = await Notification.find(query)
      .sort({ createdAt: -1 }) // Newest first
      .populate("bookId", "title") // Optional: include book title
      .lean();

    res.status(200).json({
      success: true,
      count: notifications.length,
      notifications,
    });
  } catch (error) {
    console.error("Error fetching admin notifications:", error.message);
    res.status(500).json({
      success: false,
      message: "Failed to fetch notifications",
    });
  }
};
