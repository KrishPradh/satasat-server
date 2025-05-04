const jwt = require("jsonwebtoken");
const mongoose = require("mongoose");
const Book = require('../../models/Books');

exports.getUserPosts = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) {
      return res.status(401).json({ message: "No token provided" });
    }

    const decoded = jwt.decode(token);
    // console.log("Decoded Token: ", decoded);

    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (!verified || !verified.id) {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userId = verified.id;  
    // console.log("User ID from token:", userId);

    // Update the query to use 'user' instead of 'postedBy'
    const userPosts = await Book.find({ user: new mongoose.Types.ObjectId(userId) });

    // console.log("User Posts:", userPosts);  // Log the result from the database

    if (userPosts.length === 0) {
      return res.status(404).json({ message: "No posts found for this user" });
    }

    res.status(200).json(userPosts);
  } catch (error) {
    console.error("Error in getUserPosts:", error);
    res.status(500).json({ message: "Server error" });
  }
};

