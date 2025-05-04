// const mongoose = require('mongoose');

// const ExchangeRequestSchema = new mongoose.Schema({
//     sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//     bookName: { type:String, required: true },
//     author: {type:String, required:true},
//     location:{type:String, required:true},
//     number: {type:String, required:true},
//     condition:{type: String, required:true},
//     genre:{type:String,required:true},
//     description:{type:String, required:true},
//     receiverBook: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
//     senderBookImage: { type: String , required:true},  
//     status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
//     createdAt: { type: Date, default: Date.now }
// });

// const ExchangeRequest =  mongoose.model('ExchangeRequest', ExchangeRequestSchema);

// export default ExchangeRequest



const mongoose = require('mongoose');

const ExchangeRequestSchema = new mongoose.Schema({
    sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    bookName: { type: String, required: true },
    author: { type: String, required: true },
    location: { type: String, required: true },  
    number: { type: String, required: true },    
    condition: { type: String, required: true },
    genre: { type: String, required: true },
    description: { type: String, required: true },
    receiverBook: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    senderBookImage: { type: String, required: true },
    status: { type: String, enum: ['pending', 'accepted', 'declined'], default: 'pending' },
    createdAt: { type: Date, default: Date.now }
});

const ExchangeRequest = mongoose.model('ExchangeRequest', ExchangeRequestSchema);

module.exports = ExchangeRequest;  
