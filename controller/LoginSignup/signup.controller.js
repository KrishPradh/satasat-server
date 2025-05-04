const UserModel = require("../../models/User");
const bcrypt = require("bcrypt");
const { verifyEmailMail } = require("../../utils/mailsender");
const jwt = require('jsonwebtoken')

const registerUser = async (req, res) => {
    try {
        const { name, email, password, phone, address } = req.body;

        // Validate input
        if (!name || !email || !password || !phone || !address) {
            return res.status(400).json({ success: false, message: "All fields are required" });
        }

        // Check if email already exists
        const existingUser = await UserModel.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ success: false, message: "Email already in use" });
        }

        // Hash the password
        const salt = await bcrypt.genSalt(10); 
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const createUser = await UserModel.create({
            name,
            email,
            password: hashedPassword,
            phone,
            address
        });

        const verifyToken = jwt.sign(
            { id: createUser._id },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );  

        verifyEmailMail(
            createUser.email,
            verifyToken
        )

        if (!createUser) {
            return res.status(500).json({ success: false, message: "Unable to create user" });
        }

        // Send success response
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: { id: createUser._id, name: createUser.name, email: createUser.email },
        });
    } catch (error) {
        console.error("Error during registration:", error);
        res.status(500).json({ success: false, message: "Something went wrong", error: error.message });
    }
};



const getUserCount = async (req, res) => {
    try {
        // Count total users in the database
        const users = await UserModel.find();
        const userCount = users.length;
        // console.log(userCount)
        // Send response
        res.status(200).json({
            success: true,
            count: userCount
        });
    } catch (error) {
        console.error("Error getting user count:", error);
        res.status(500).json({ 
            success: false, 
            message: "Unable to retrieve user count", 
            error: error.message 
        });
    }
};


const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.find({});
        res.status(200).json({
            success: true,
            users
        });
    } catch (error) {
        console.error("Error fetching users:", error);
        res.status(500).json({ 
            success: false, 
            message: "Unable to retrieve users", 
            error: error.message 
        });
    }
};

const deleteUser = async (req, res) => {
    try {
      const userId = req.params.id;
    //   console.log("User ID param:", userId);
  
      const user = await UserModel.findById(userId);
      if (!user) {
        return res.status(404).json({ success: false, message: "User not found" });
      }
  
      await UserModel.findByIdAndDelete(userId);
  
      res.status(200).json({ success: true, message: "User deleted successfully" });
    } catch (error) {
      console.error("Error deleting user:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
    }
  };
  

  const verifyEmail = async (req, res) => {
    try {
        const { token } = req.params;
        if (!token) {
            return res.status(400).json({ success: false, message: "Token is required" });
        }

        let decoded;
        try {
            decoded = jwt.verify(token, process.env.JWT_SECRET);
        } catch (err) {
            return res.status(400).json({ success: false, message: "Invalid or expired token" });
        }

        const user = await UserModel.findById(decoded.id);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        user.verify = true;
        await user.save();

        return res.status(200).json({ success: true, message: "Email verified successfully" });

    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: "Internal server error" });
    }
};




module.exports = { registerUser, getUserCount, getAllUsers, deleteUser, verifyEmail };

    