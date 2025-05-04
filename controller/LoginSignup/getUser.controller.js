// const jwt = require('jsonwebtoken');
// const UserModel = require('../../models/User');

// const getUser = async (req, res) => {
//     try {
//         const token = req.cookies.token; 

//         if (!token) {
//             return res.status(401).json({ success: false, message: 'Unauthorized' });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey');

//         // Fetch user details from the database
//         const user = await UserModel.findById(decoded.id).select('-password'); // Exclude password from response

//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         // res.status(200).json({
//         //     success: true,
//         //     user: {
//         //         id: user._id,
//         //         name: user.name,
//         //         email: user.email,
//         //         profilePicture: user.profilePicture || '', // Optional: add profile picture field
//         //     },
//         // });
//         res.status(200).json({
//             success: true,
//             user: {
//               id: user._id,
//               name: user.name,
//               email: user.email,
//               phone: user.phone,
//               address: user.address,
//               profilePicture: user.profilePicture || '',
//             },
//           });

//     } catch (error) {
//         console.error('Error fetching user:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// };

// module.exports = { getUser };


const jwt = require('jsonwebtoken');
// const QRCode = require('qrcode');
const UserModel = require('../../models/User');

// GET user details
const getUser = async (req, res) => {
    try {
        const token = req.cookies.token;

        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey');

        // Fetch user from DB
        const user = await UserModel.findById(decoded.id).select('-password');

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        res.status(200).json({
            success: true,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                qrCode: user.qrCode || '',
            },
        });

    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

// POST generate QR code
// const cloudinary = require('cloudinary').v2;

// // Configure Cloudinary (put this in your config files, not in the controller)
// cloudinary.config({
//   cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
//   api_key: process.env.CLOUDINARY_API_KEY,
//   api_secret: process.env.CLOUDINARY_API_SECRET
// });

// const uploadQRCode = async (req, res) => {
//     try {
//         const token = req.cookies.token;

//         if (!token) {
//             return res.status(401).json({ success: false, message: 'Unauthorized' });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey');
//         const user = await UserModel.findById(decoded.id);

//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         // Check if file is included in the request
//         if (!req.file) {
//             return res.status(400).json({ success: false, message: 'No QR code image uploaded' });
//         }

//         // Upload to Cloudinary
//         const result = await cloudinary.uploader.upload(req.file.path, {
//             folder: 'qr_codes', // Optional folder in your Cloudinary account
//             // public_id: `user_${user._id}_qrcode`, // Optional custom public ID
//         });

//         // Save the Cloudinary URL to the user's profile
//         user.qrCode = result.secure_url;
//         await user.save();

//         // If using multer's disk storage, you might want to delete the local file after upload
//         // fs.unlinkSync(req.file.path);

//         res.status(200).json({ 
//             success: true, 
//             message: 'QR Code uploaded successfully',
//             qrCodeUrl: result.secure_url // Return the URL to the frontend
//         });
//     } catch (error) {
//         console.error('Error uploading QR code:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// };

// const getQRCodebyid = async (req, res) => {
//     try {
//         const token = req.cookies.token;

//         if (!token) {
//             return res.status(401).json({ success: false, message: 'Unauthorized' });
//         }

//         const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey');
//         const user = await UserModel.findById(decoded.id);

//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         // If user has a QR code, return it
//         if (user.qrCode) {
//             return res.status(200).json({ success: true, qrCodeUrl: user.qrCode });
//         } else {
//             return res.status(404).json({ success: false, message: 'QR code not found for this user' });
//         }
//     } catch (error) {
//         console.error('Error getting QR code:', error);
//         res.status(500).json({ success: false, message: 'Internal server error' });
//     }
// };


module.exports = {
    getUser,
};
