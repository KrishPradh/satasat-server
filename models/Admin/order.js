const mongoose = require('mongoose');

// const orderSchema = new mongoose.Schema(
//   {
//     purchaseOrderId: { type: String, required: true, unique: true },  // Unique order ID (generated on frontend)
//     userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },  // Reference to the user placing the order
//     bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'AdminBook', required: true },  // Reference to the book being purchased
//     totalAmount: { type: Number, required: true },  // Total order amount (NPR, in paisa)
//     paymentMethod: { type: String, enum: ['khalti', 'cod'], required: true },  // Payment method ('khalti' or 'cod')
//     paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },  // Payment status
//     address: { type: String, required: true },  // Shipping address
//     bookTitle: { type: String, required: true },  // Title of the book
//     bookAuthor: { type: String, required: true },  // Author of the book
//     bookImage: { type: String },  // Optional: Image URL of the book (for display purposes)
//     paymentUrl: { type: String },  // URL to redirect for Khalti payment (only for Khalti payments)
//     createdAt: { type: Date, default: Date.now },  // Date and time when the order was created
//     updatedAt: { type: Date, default: Date.now },  // Date and time when the order was last updated
//   },
//   { timestamps: true }
// );


const orderSchema = new mongoose.Schema(
  {
    purchaseOrderId: { type: String, required: true, unique: true },
    // pidx: { type: String, unique: true }, // ✅ ADD THIS
    pidx: { type: String, unique: true, required: function() { return this.paymentMethod === 'khalti'; } },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookId: [{ type: mongoose.Schema.Types.ObjectId, ref: 'AdminBook', required: true }],
    totalAmount: { type: Number, required: true },
    paymentMethod: { type: String, enum: ['khalti', 'cod'], required: true },
    paymentStatus: { type: String, enum: ['pending', 'completed', 'failed'], default: 'pending' },
    address: { type: String, required: true },
    bookTitle: { type: String, required: true },
    bookAuthor: { type: String, required: true },
    bookImage: { type: String },
    paymentUrl: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  { timestamps: true }
);


const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
