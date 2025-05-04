// routes/userRoutes.js
const express = require('express');
const userPostRouter = express.Router();
const { getUserPosts } = require('../../controller/geUserpostController/getUserPostController');
// const authenticate = require('../middleware/authMiddleware'); // Assuming JWT-based auth

// Route to get user-specific posts
userPostRouter.get('/userposts', getUserPosts);

module.exports = userPostRouter;

