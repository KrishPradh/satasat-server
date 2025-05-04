const AdminModel = require('../../../models/Admin/Admin');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const loginAdmin = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase();

        // Check if user exists
        const user = await AdminModel.findOne({ email: normalizedEmail });
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
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
            maxAge: 3600000,  // Cookie expiration time (1 hour)
            sameSite: 'strict', // Protect against CSRF
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

const registerAdmin = async (req, res) => {
    try {
        const { name, email, phone, password } = req.body;

        // Validate input
        if (!name || !email || !phone || !password) {
            return res.status(400).json({ success: false, message: 'All fields are required' });
        }

        // Normalize email
        const normalizedEmail = email.toLowerCase();

        // Check if admin already exists
        const existingAdmin = await AdminModel.findOne({ email: normalizedEmail });
        if (existingAdmin) {
            return res.status(409).json({ success: false, message: 'Admin with this email already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new admin
        const newAdmin = new AdminModel({
            name,
            email: normalizedEmail,
            phone,
            password: hashedPassword
        });

        await newAdmin.save();

        res.status(201).json({ 
            success: true, 
            message: 'Admin registered successfully',
            admin: {
                id: newAdmin._id,
                name: newAdmin.name,
                email: newAdmin.email,
                phone: newAdmin.phone
            }
        });
    } catch (error) {
        console.error('Error during admin registration:', error);
        res.status(500).json({ success: false, message: 'Something went wrong', error: error.message });
    }
};

module.exports = { loginAdmin, registerAdmin };