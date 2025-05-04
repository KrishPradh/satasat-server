const Notification = require("../../models/Notification");
const Book = require("../../models/Books"); // Optional, for dynamic book title

// exports.createNotification = async ({ userId, bookOwner, type, bookId }) => {
//   try {
//     let message = 'You have a new notification.';

//     console.log('Notification creation: type =', type);

//     if (bookId) {
//       const book = await Book.findById(bookId).select('title');
//       const bookTitle = book?.title || 'a book';

//       console.log('Notification type received:', type);

//       switch (type) {
//         case 'exchange_request':
//           message = `You received an exchange request for "${bookTitle}".`;
//           break;
//         case 'rental_request':
//           message = `You received a rental request for "${bookTitle}".`;
//           break;
//         case 'purchase':
//           message = `"${bookTitle}" has been purchased.`;
//           break;
//         case 'rental_accepted':
//           message = `Your rental request for "${bookTitle}" has been accepted.`;
//           break;
//         case 'rental_declined':
//           message = `Your rental request for "${bookTitle}" has been declined.`;
//           break;
//         case 'exchangereq_accepted':
//           message = `Your exchange request for "${bookTitle}" has been accepted.`;
//           break;
//         case 'exchangereq_declined':
//           message = `Your exchange request for "${bookTitle}" has been declined.`;
//           break;
//       }
//     }

//     const notification = await Notification.create({
//       userId,
//       bookOwner,
//       type,
//       bookId,
//       message,
//     });

//     return notification;
//   } catch (error) {
//     console.error('Error creating notification:', error.message);
//     return null;
//   }
// };



exports.createNotification = async ({ userId, bookOwner, type, bookId }) => {
  try {
    if (!userId || !bookOwner) {
      throw new Error(
        "Missing userId or bookOwner while creating notification"
      );
    }

    let message = "You have a new notification.";

    // console.log('Notification creation: type =', type);
    // console.log('Notification creation: bookId =', bookId);

    if (bookId) {
      const book = await Book.findById(bookId).select("title");
      if (!book) {
        console.log("Book not found with bookId:", bookId); // Log if the book is not found
      }
      const bookTitle = book?.title || "a book";

      // console.log('Notification type received:', type);

      switch (type) {
        case "exchange_request":
          message = `You received an exchange request for "${bookTitle}".`;
          break;
        case "rental_request":
          message = `You received a rental request for "${bookTitle}".`;
          break;
        case "Codpurchase":
          message = `"${bookTitle}" has been purchased successfully with Cash on Delivery option.`;
          break;
        case "Codpaid":
            // message = `"${bookTitle}" has been purchased successfully and paid.`;
          message = `"${bookTitle}" book payment has been successfully completed.`;
          break;
        case "Qrpurchase":
          message = `"${bookTitle}" has been purchased successfully via QR payment. Please check payment slip for confirmation.`;
          break;
        case "rental_accepted":
          message = `Your rental request for "${bookTitle}" has been accepted.`;
          break;
        case "rental_declined":
          message = `Your rental request for "${bookTitle}" has been declined.`;
          break;
        case "exchange_accepted":
          message = `Your exchange request for "${bookTitle}" has been accepted.`;
          break;
        case "exchange_declined":
          message = `Your exchange request for "${bookTitle}" has been declined.`;
          break;
        default:
          console.log("Notification type did not match any case");
      }
    }

    // console.log('Notification message:', message);

    const notification = await Notification.create({
      userId,
      bookOwner,
      type,
      bookId,
      message,
    });

    return notification;
  } catch (error) {
    console.error("Error creating notification:", error.message);
    return null;
  }
};

// const Book = require('../models/Book');
// const AdminBook = require('../../models/Admin/AdminBooks'); // import your AdminBook model

// exports.createNotification = async ({ userId, bookOwner, type, bookId }) => {
//   try {
//     if (!userId || !bookOwner) {
//       throw new Error("Missing userId or bookOwner while creating notification");
//     }

//     let message = "You have a new notification.";

//     let bookTitle = "a book";

//     if (bookId) {
//       // First, try finding in normal Book model
//       let book = await Book.findById(bookId).select("title");

//       if (!book) {
//         // If not found, try finding in AdminBook model
//         book = await AdminBook.findById(bookId).select("title");
//       }

//       if (!book) {
//         console.log("Book not found with bookId in both models:", bookId);
//       } else {
//         bookTitle = book.title;
//       }

//       switch (type) {
//         case "exchange_request":
//           message = `You received an exchange request for "${bookTitle}".`;
//           break;
//         case "rental_request":
//           message = `You received a rental request for "${bookTitle}".`;
//           break;
//         case "Codpurchase":
//           message = `"${bookTitle}" has been purchased successfully with Cash on Delivery option.`;
//           break;
//         case "Qrpurchase":
//           message = `"${bookTitle}" has been purchased successfully via QR payment. Please check payment slip for confirmation.`;
//           break;
//         case "rental_accepted":
//           message = `Your rental request for "${bookTitle}" has been accepted.`;
//           break;
//         case "rental_declined":
//           message = `Your rental request for "${bookTitle}" has been declined.`;
//           break;
//         case "exchange_accepted":
//           message = `Your exchange request for "${bookTitle}" has been accepted.`;
//           break;
//         case "exchange_declined":
//           message = `Your exchange request for "${bookTitle}" has been declined.`;
//           break;
//         case "new_order":
//           message = `New order placed for "${bookTitle}".`;
//           break;
//         default:
//           console.log("Notification type did not match any case");
//       }
//     }

//     const notification = await Notification.create({
//       userId,
//       bookOwner,
//       type,
//       bookId,
//       message,
//     });

//     return notification;
//   } catch (error) {
//     console.error("Error creating notification:", error.message);
//     return null;
//   }
// };



exports.getUserNotifications = async (req, res) => {
  try {
    // const userId = req.userId;
    const { userId } = req.params;

    // Find notifications for the user
    const notifications = await Notification.find({ userId })
      .populate("bookOwner", "name")
      .populate("bookId", "title")
      .sort({ createdAt: -1 });

    if (!notifications) {
      return res
        .status(404)
        .json({
          success: false,
          message: "No notifications found for this user",
        });
    }

    res.status(200).json({ success: true, data: notifications });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching notifications",
        error: error.message,
      });
  }
};
