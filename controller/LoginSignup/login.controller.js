// const UserModel = require('../models/User');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Validate input
//         if (!email || !password) {
//             return res.status(400).json({ success: false, message: 'All fields are required' });
//         }

//         // Check if user exists
//         const user = await UserModel.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         // Verify password
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ success: false, message: 'Invalid credentials' });
//         }

//         // Generate JWT token
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });
//         // Set the cookie
//         res.cookie('token', token, {
//             httpOnly: true,  // Prevents client-side JavaScript from accessing the cookie
//             //secure: process.env.NODE_ENV === 'production', // Use HTTPS in production
//             maxAge: 3600000  // Cookie expiration time in milliseconds (1 hour)
//         });

//         res.status(200).json({
//             success: true,
//             message: 'Login successful',
//             token,
//         });
          
//     } catch (error) {
//         console.error('Error during login:', error);
//         res.status(500).json({ success: false, message: 'Something went wrong', error: error.message });
//     }
// };

// module.exports = { loginUser };



// ---current--
// const UserModel = require('../../models/User');
// const bcrypt = require('bcrypt');
// const jwt = require('jsonwebtoken');

// const loginUser = async (req, res) => {
//     try {
//         const { email, password } = req.body;

//         // Validate input
//         if (!email || !password) {
//             return res.status(400).json({ success: false, message: 'All fields are required' });
//         }

//         // Check if user exists
//         const user = await UserModel.findOne({ email });
//         if (!user) {
//             return res.status(404).json({ success: false, message: 'User not found' });
//         }

//         // Verify password
//         const isPasswordValid = await bcrypt.compare(password, user.password);
//         if (!isPasswordValid) {
//             return res.status(401).json({ success: false, message: 'Invalid credentials' });
//         }

//         // Generate JWT token
//         const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1h' });

//         // Set the cookie with HttpOnly flag and secure flag for production
//         res.cookie('token', token, {
//             httpOnly: true,  // Prevents client-side JavaScript from accessing the cookie
//             secure: true, // Only set secure cookies in production
//             maxAge: 3600000,  // Cookie expiration time in milliseconds (1 hour)
//         });

//         // Do not send the token in the response body (it is already in the cookie)
//         res.status(200).json({
//             success: true,
//             message: 'Login successful',
//         });
          
//     } catch (error) {
//         console.error('Error during login:', error);
//         res.status(500).json({ success: false, message: 'Something went wrong', error: error.message });
//     }
// };

// module.exports = { loginUser };


// ---updated---
const UserModel = require('../../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginUser = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase();

        // Check if user exists
        const user = await UserModel.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        if(user.verify==false){
            return res.status(404).json({ success: false, message: 'User not verified' });
        }

        // Verify password
        const isPasswordValid = await bcrypt.compare(password, user.password);
        if (!isPasswordValid) {
            return res.status(401).json({ success: false, message: 'Invalid credentials' });
        }

        // Generate JWT token
        const jwtSecret = process.env.JWT_SECRET || 'defaultSecretKey';
        const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });

        // Set the cookie with HttpOnly flag and secure flag for production
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            maxAge: 3600000,  
            sameSite: 'strict', 
        });

        // Send response without including token in the body
        res.status(200).json({
            success: true,
            message: 'Login successful',
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
            },
            token
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ success: false, message: 'Something went wrong', error: error.message });
    }
};

module.exports = { loginUser };
