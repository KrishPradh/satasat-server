const mongoose = require('mongoose');

const adminbookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    description: { type: String, required: true },
    bookImage: { type: String, default: "", required: true },
    bookPurpose: { 
        type: String, 
        enum: ['new'], 
        default: 'new',
        required: true 
    },
    price: { type: Number, required: false },
    delivery: { type: String, enum: ['Yes', 'No'], required: true },
    // admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true }, 
    admin: { type: mongoose.Schema.Types.ObjectId, ref: "Admin", required: true },
    createdAt: { type: Date, default: Date.now },
});

const AdminBook = mongoose.model('AdminBook', adminbookSchema);

module.exports = AdminBook;