// models/Notification.js

const mongoose = require('mongoose');

const adminnotificationSchema = new mongoose.Schema({
  adminId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Admin',
    // required: true,
  },
  bookBuyer:{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  type: {
    type: String,
    enum: ['Codpurchase', 'Khaltipurchase','cod_completed', 'cod_failed'],
    required: true, 
  },
  message: {
    type: String,
    required: true,
  },
  bookId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'AdminBook',
    default: null,
  },
  isRead: {
    type: Boolean,
    default: false,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  }
});

module.exports = mongoose.model('AdminNotification', adminnotificationSchema);
