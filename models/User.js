const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  phone:{
    type: Number,
    required: true,
  },
  address:{
    type: String,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  verify: {
    type: Boolean,
    default:false
  },
  // qrCode: {
  //   type: String,
  //   default: '', // Added to store Cloudinary QR code URL
  // },
});

const UserModel = mongoose.model('User', userSchema);

module.exports = UserModel;
