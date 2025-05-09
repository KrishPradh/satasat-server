const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
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
  password: {
    type: String,
    required: true
  }
});

const AdminModel = mongoose.model('Admin', adminSchema);

module.exports = AdminModel;
