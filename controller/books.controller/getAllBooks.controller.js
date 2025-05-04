// const Book = require("../../models/Books");


// const getAllBooks = async (req, res) => {
//     try {
//         // const books = await Book.find({});
//         const books = await Book.find().populate("user", "name");
//         const booksCount = books.length;
//         // console.log(booksCount)
//         // res.status(200).json(books);
//         // res.status(200).json(totalBooks);
//         return res.status(200).json({ books, booksCount });
//     } catch (error) {
//         console.error('Error fetching books:', error);
//         res.status(500).json({ error: 'Failed to fetch books' });
//     }
// };

// module.exports = { getAllBooks };



const Order = require("../../models/Admin/order");
const Payment = require("../../models/Payment");
const Book = require("../../models/Books");
const ExchangeRequest = require("../../models/ExchangeRequest");
const RentRequest = require("../../models/RentalRequest");

const getAllBooks = async (req, res) => {
    try {
        const books = await Book.find().populate("user", "name");
        const booksCount = books.length;

        return res.status(200).json({
            success: true,   // ✅ Adding success key
            books,
            booksCount
        });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch books' });
    }
};


// const deleteBook = async (req, res) => {
//   const { id } = req.params;
//   // console.log(id);

//   try {
//     const deletedBook = await Book.findByIdAndDelete(id);

//     if (!deletedBook) {
//       return res.status(404).json({
//         success: false,
//         message: 'Book not found',
//       });
//     }

//     res.status(200).json({
//       success: true,
//       message: 'Book deleted successfully',
//       deletedBook,
//     });
//   } catch (error) {
//     console.error('Error deleting book:', error.message);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//     });
//   }
// };


// const deleteBook = async (req, res) => {
//   const { id } = req.params;
//   console.log("Deleting Book ID:", id);

//   try {
//     const deletedBook = await Book.findByIdAndDelete(id);

//     if (!deletedBook) {
//       return res.status(404).json({
//         success: false,
//         message: 'Book not found',
//       });
//     }

//     // Delete related ExchangeRequests
//     await ExchangeRequest.deleteMany({ book: id });

//     // Delete related RentalRequests
//     await RentRequest.deleteMany({ book: id });

//     // Delete from Exchange collection
//     await Order.deleteMany({ book: id });

//     // Delete from Rental collection
//     await Payment.deleteMany({ book: id });

//     // // Remove from all users' wishlist and cart
//     // await User.updateMany(
//     //   {},
//     //   {
//     //     $pull: {
//     //       wishlist: id,
//     //       cart: id,
//     //     },
//     //   }
//     // );

//     res.status(200).json({
//       success: true,
//       message: 'Book deleted from all locations successfully',
//       deletedBook,
//     });
//   } catch (error) {
//     console.error('Error deleting book:', error.message);
//     res.status(500).json({
//       success: false,
//       message: 'Internal server error',
//     });
//   }
// };


const deleteBook = async (req, res) => {
  const { id } = req.params;
  console.log("Deleting Book ID:", id);

  try {
    // Delete the book from the Book collection
    const deletedBook = await Book.findByIdAndDelete(id);

    if (!deletedBook) {
      return res.status(404).json({
        success: false,
        message: 'Book not found',
      });
    }

    // Delete related ExchangeRequests where book is either senderBook or receiverBook
    await ExchangeRequest.deleteMany({ 
      $or: [
        { senderBook: id },
        { receiverBook: id }
      ]
    });

    // Delete related RentRequests where book is involved
    await RentRequest.deleteMany({ bookId: id });

    // Delete related Payments where book is involved
    await Payment.deleteMany({ bookId: id });

    // Delete related ExchangeRequests, RentalRequests, Payments
    // await ExchangeRequest.deleteMany({ book: id });
    // await RentRequest.deleteMany({ book: id });
    // await Payment.deleteMany({ book: id });

    // Remove the book from all users' carts
    // await Cart.updateMany(
    //   { 'books.bookId': id },
    //   {
    //     $pull: { books: { bookId: id } }
    //   }
    // );

    res.status(200).json({
      success: true,
      message: 'Book deleted from all locations successfully',
      deletedBook,
    });
  } catch (error) {
    console.error('Error deleting book:', error.message);
    res.status(500).json({
      success: false,
      message: 'Internal server error',
    });
  }
};


module.exports = { getAllBooks,deleteBook };
