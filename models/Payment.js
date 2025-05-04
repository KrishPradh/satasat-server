// models/Payment.js
// const mongoose = require('mongoose');

// const paymentSchema = new mongoose.Schema({
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   bookId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'AdminBook',
//     required: false // only if applicable
//   },
//   khaltiTransactionId: {
//     type: String,
//     required: true
//   },
//   amount: {
//     type: Number,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'completed', 'failed'],
//     default: 'pending'
//   },
//   mobile: {
//     type: String,
//     required: true
//   },
//   khaltiPayload: {
//     type: Object, 
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Payment', paymentSchema);


// const mongoose = require('mongoose');

// const paymentSchema = new mongoose.Schema({
//   buyerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   sellerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   bookId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Book',
//     required: false 
//   },
//   transactionId: {
//     type: String,
//     required: true
//   },
//   amount: {
//     type: Number,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'completed', 'failed'],
//     default: 'pending'
//   },
//   mobile: {
//     type: String,
//     required: true
//   },
//   shippingAddress: {
//     type: Object,
//     required: true
//   },
//   payload: {
//     type: Object, 
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// module.exports = mongoose.model('Payment', paymentSchema);




// const mongoose = require('mongoose');
// const paymentSchema = new mongoose.Schema({
//   buyerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   sellerId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   bookId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Book',
//     required: false 
//   },
//   transactionId: {
//     type: String,
//     required: true
//   },
//   amount: {
//     type: Number,
//     required: true
//   },
//   status: {
//     type: String,
//     enum: ['pending', 'completed', 'failed'],
//     default: 'pending'
//   },
//   mobile: {
//     type: String,
//     required: true
//   },
//   shippingAddress: {
//     type: Object,
//     required: true
//   },
//   payload: {
//     type: Object, 
//     required: true
//   },
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// // Create the Payment model
// const Payment = mongoose.model('Payment', paymentSchema);



const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
  buyerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sellerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Book'
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'qr'],
    required: true
  },
  transactionId: {
    type: String // Optional: you can make this required later after confirming payment
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  mobile: {
    type: String,
    required: true
  },
  shippingAddress: {
    type: Object,
    required: true
  },
  paymentSlip: {
    type: String, // This will store a file path or URL
    required: function () {
      return this.paymentMethod === 'qr';
    }
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// module.exports = mongoose.model('Payment', paymentSchema);
const Payment = mongoose.model('Payment', paymentSchema);
module.exports = Payment;

