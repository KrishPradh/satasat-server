const mongoose = require("mongoose");

const RentRequestSchema = new mongoose.Schema({
  renterUserId: {type: mongoose.Schema.Types.ObjectId, ref: "User", required: true,},
  ownerUserId: {type: mongoose.Schema.Types.ObjectId, ref: "User",required: true,},
  bookId: { type: mongoose.Schema.Types.ObjectId, ref: "Book", required: true,},
  // ownerBookImage: { type: String, required: true },
  duration: {
    months: { type: Number, default: 0 },
    weeks: { type: Number, default: 0 },
    days: { type: Number, default: 0 },
  },
  securityDeposit: { type: Number, required: true,},
  rentalTerms: {type: String, required: true,},
  location: {type: String, required: true,},
  phoneNumber: {type: String, required: true,},
  totalPrice:{type: Number, required: true},
  status: {
    type: String,
    enum: ["pending", 'accepted', 'declined'],
    default: "pending",
  },
  createdAt: {type: Date, default: Date.now,},
});

const RentRequest = mongoose.model('RentalRequest', RentRequestSchema);

module.exports = RentRequest;  
