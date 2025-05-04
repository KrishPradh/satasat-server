// const mongoose = require('mongoose');

// const feedbackSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     email: { type: String, required: true },
//     message: { type: String, required: true },
//     rating: {
//         type: Number,
//         required: true,
//         min: 1,
//         max: 5,
//     }
// }, { timestamps: true });

// module.exports = mongoose.model('Feedback', feedbackSchema);

const mongoose = require('mongoose');
const User = require('../models/User'); // Import User model

const feedbackSchema = new mongoose.Schema({
    name: {
        type: mongoose.Schema.Types.ObjectId, // Reference to the User model
        ref: 'User', 
        required: true,
    },
    email: {
        type: String,  
        required: true,
    },
    message: { 
        type: String, 
        required: true 
    },
    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5,
    }
}, { timestamps: true });

module.exports = mongoose.model('Feedback', feedbackSchema);

