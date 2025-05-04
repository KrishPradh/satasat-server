const jwt = require('jsonwebtoken');
const ExchangeRequest = require('../../models/ExchangeRequest'); // Import your ExchangeRequest model
const Book = require('../../models/Books'); // Import your Book model
const UserModel = require('../../models/User');
const mongoose = require('mongoose');
const { uploadFile } = require('../../Cloudinary/Cloudinary'); // Import the uploadFile function
const { createNotification } = require('../Notification.controller/notfication.controller');

// exports.createRequest = async (req, res) => {
//     try {
//         // Get token from cookies
//         const token = req.cookies.token;
//         if (!token) {
//             return res.status(401).json({ message: 'Unauthorized: No token found' });
//         }

//         // Verify and decode token
//         const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey');
//         const senderUserId = decoded.id; // Extract user ID from token

//         // Destructure request body
//         const { bookName, author, location, phoneNumber, condition, genre, description, reciverUserId, reciverBookId } = req.body;
        
//         // When using multer.fields(), files are stored in req.files object
//         let senderBookImage = null;
//         if (req.files && req.files.senderBookImage && req.files.senderBookImage[0]) {
//             senderBookImage = req.files.senderBookImage[0].path;
//         }

//         // Check if the requested book exists
//         const getBook = await Book.findById(reciverBookId);
//         if (!getBook) {
//             return res.status(404).json({ message: 'Requested book not found' });
//         }

//         // Create a new exchange request
//         const newRequest = new ExchangeRequest({
//             sender: senderUserId, // Use senderUserId from token
//             receiver: reciverUserId,
//             bookName,
//             author,
//             location,
//             number: phoneNumber,
//             condition,
//             genre,
//             description, 
//             receiverBook: reciverBookId,
//             senderBookImage
//         });

//         await newRequest.save();
//         res.status(201).json({ message: 'Exchange request sent', request: newRequest });

//     } catch (error) {
//         console.error('Error sending exchange request:', error);
//         res.status(500).json({ message: 'Internal server error', error });
//     }
// };




//     try {
        
//         const receiverId = req.query.userId; 
        

//         // Validate receiverId
//         if (!receiverId) {
//             return res.status(400).json({ success: false, message: 'Receiver ID is required' });
//         }

//         // Fetch exchange requests for the receiver
//         const exchangeRequests = await ExchangeRequest.find({ receiver: receiverId })
//             // .populate('sender', 'name email') // Populate sender details
//             // .populate('receiver', 'name email') // Populate receiver details
//             // .populate('receiverBook') // Populate receiver book details
//             // .populate('senderBookImage'); // Populate sender book image

//         // Check if any requests were found
//         if (!exchangeRequests || exchangeRequests.length === 0) {
//             return res.status(404).json({ success: false, message: 'No exchange requests found for this user' });
//         }

//         // Send the response
//         res.status(200).json({ success: true, requests: exchangeRequests });
//     } catch (error) {
//         console.error('Error fetching user exchange requests:', error);


//         res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
//     }
// };




// exports.getRequests = async (req, res) => {
//     try {
//         const receiverId = req.query.userId;


//         // Validate receiverId
//         if (!receiverId) {
//             return res.status(400).json({ success: false, message: 'Receiver ID is required' });
//         }

//         // Fetch exchange requests where receiver matches the given ID
//         const exchangeRequests = await ExchangeRequest.find({ receiver: receiverId });

//         // Check if any requests were found
//         if (!exchangeRequests.length) {
//             return res.status(404).json({ success: false, message: 'No exchange requests found for this user' });
//         }

//         // Send the response
//         res.status(200).json({ success: true, requests: exchangeRequests });

//     } catch (error) {
//         // console.error('Error fetching user exchange requests:', error);
//         res.status(500).json({ success: false, message: 'Internal server error', error: error.message });
//     }
// };

//--updated--



exports.createRequest = async (req, res) => {
    try {
        const token = req.cookies.token;
        if (!token) {
            return res.status(401).json({ message: 'Unauthorized: No token found' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey');
        const senderUserId = decoded.id;

        const { bookName, author, location, phoneNumber, condition, genre, description, reciverUserId, reciverBookId } = req.body;

        let senderBookImage = null;
        if (req.files && req.files.senderBookImage && req.files.senderBookImage[0]) {
            const localPath = req.files.senderBookImage[0].path;

            // Upload to Cloudinary
            const cloudinaryResult = await uploadFile(localPath, "ExchangeBooks");

            if (!cloudinaryResult) {
                return res.status(500).json({ message: 'Failed to upload sender book image to Cloudinary' });
            }

            // Use Cloudinary URL
            senderBookImage = cloudinaryResult.secure_url;
        }

        const getBook = await Book.findById(reciverBookId);
        // console.log(getBook)
        if (!getBook) {
            return res.status(404).json({ message: 'Requested book not found' });
        }

        const newRequest = new ExchangeRequest({
            sender: senderUserId,
            receiver: reciverUserId,
            bookName,
            author,
            location,
            number: phoneNumber,
            condition,
            genre,
            description, 
            receiverBook: reciverBookId,
            senderBookImage // now the Cloudinary URL
        });

        await newRequest.save();

        await createNotification({
            userId: reciverUserId,
            bookOwner: senderUserId ,
            type: 'exchange_request',
            bookId: reciverBookId,
          });

        res.status(201).json({ message: 'Exchange request sent', request: newRequest });

    } catch (error) {
        console.error('Error sending exchange request:', error);
        res.status(500).json({ message: 'Internal server error', error });
    }
};



exports.getRequests = async (req, res) => {
    try {
        const userId = req.query.userId;

        // Validate userId
        if (!userId) {
            return res.status(400).json({ success: false, message: "User ID is required" });
        }

        // Fetch requests where the user is either the sender or receiver
        const receivedRequests = await ExchangeRequest.find({ receiver: userId }).populate("sender", "name");;
        const sentRequests = await ExchangeRequest.find({ sender: userId }).populate("receiver", "name");;

        // Send response with both received and sent requests
        res.status(200).json({          
            success: true,
            receivedRequests,
            sentRequests,
        });

    } catch (error) {
        console.error("Error fetching exchange requests:", error);
        res.status(500).json({ success: false, message: "Internal server error", error: error.message });
    }
};

exports.getBookRequestById = async (req, res) => {
    try {
        const requestId = req.params.id; 

        const exchangeRequest = await ExchangeRequest.findById(requestId).populate("sender", "name")  
        .populate("receiver"); 

        if (!exchangeRequest) {
            return res.status(404).json({ success: false, message: "Exchange request not found" });
        }

        res.status(200).json({ success: true, request: exchangeRequest });
    } catch (error) {
        console.error("Error fetching exchange request details:", error);
        res.status(500).json({ success: false, message: "Internal server error" });
    }
};



exports.updateRequestStatus = async (req, res) => {
    // console.log(req.body); 
    try {
        const { requestId, status } = req.body;
        if (!requestId || !status) return res.status(400).json({ message: "Missing fields" });

        const request = await ExchangeRequest.findById(requestId);
        if (!request) return res.status(404).json({ message: "Request not found" });

        request.status = status;
        await request.save();

        await createNotification({
              userId: request.sender,             
              bookOwner: request.receiver,           
              type: `exchange_${status}`,                     
              bookId: request.receiverBook
            });

        res.status(200).json({ message: `Request updated to ${status}` });
    } catch (error) {
        console.error("Error updating request:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};
