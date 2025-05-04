// const mongoose = require("mongoose");

// const CartSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: "User",
//     required: true,
//   },
//    bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
//    quantity: { type: Number, default: 1 },
    

//   createdAt: { type: Date, default: Date.now },
// });

// module.exports = mongoose.model("Cart", CartSchema);

const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  books: [
    {
      bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminBook', required: true },
      quantity: { type: Number, required: true }
    }
  ]
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
