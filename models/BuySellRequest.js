const mongoose = require('mongoose');

const BuySchema = new mongoose.Schema({
  buyer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  seller: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
  price: { type: Number, required: true },
  location: { type: String, required: true }, 
  phoneNumber: { type: String, required: true },
  status: { 
    type: String, 
    enum: ['pending', 'confirmed', 'canceled', 'shipped', 'delivered'],
    default: 'pending' 
  },
  paymentStatus: { 
    type: String, 
    enum: ['pending', 'paid'], 
    default: 'pending' 
  },
  subtotal: { type: Number, required: true }, 
  shippingFee: { type: Number, default: 0 }, // Shipping fee for the order (e.g., free or a fixed fee)
  totalAmount: { type: Number, required: true }, // Final amount after discount and shipping

  // Date and Time the order was created
  createdAt: { type: Date, default: Date.now },
});

const BuySell = mongoose.model('Buy', BuySchema);

module.exports = BuySell;
