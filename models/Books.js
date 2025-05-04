
// const mongoose = require('mongoose');

// const bookSchema = new mongoose.Schema({
//     title: { type: String, required: true },
//     author: { type: String, required: true },
//     genre: { type: String, required: true },
//     description: { type: String, required: true },
//     bookImage: { type: String, default: "", required: true },
//     condition: { type: String, enum: ['New', 'Used'], required: true },
//     bookPurpose: { 
//         type: String, 
//         enum: ['Buy/Sell', 'Exchange', 'Rent'], 
//         required: true 
//     },
//     price:
//     user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, // Reference to the user
//     createdAt: { type: Date, default: Date.now },
// });

// const Book = mongoose.model('Book', bookSchema);

// module.exports = Book;




const mongoose = require('mongoose');

const bookSchema = new mongoose.Schema({
    title: { type: String, required: true },
    author: { type: String, required: true },
    genre: { type: String, required: true },
    description: { type: String, required: true },
    bookImage: { type: String, default: "", required: true },
    qrcodeImage: { type: String, default: "", required: false },
    condition: { type: String, enum: ['New', 'Used'], required: true },
    bookPurpose: { 
        type: String, 
        enum: ['Buy/Sell', 'Exchange', 'Rent'], 
        required: true 
    },
    price: { type: Number, required: false }, 
    phoneNumber: { type: String, required: true },
    location: { type: String, required: true },
    delivery: { type: String, enum: ['Yes', 'No'], required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true }, 
    createdAt: { type: Date, default: Date.now },
});

const Book = mongoose.model('Book', bookSchema);

module.exports = Book;
