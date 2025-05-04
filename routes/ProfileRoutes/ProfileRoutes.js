// const express = require('express');
// const ProfileRoute = express.Router();
// const { getUserProfile, updateUserProfile } = require('../../controller/ProfileController/ProfileController');
// // const verifyToken = require('../middleware/verifyToken'); // Middleware to verify JWT token

// // Route to get the user's profile
// ProfileRoute.get('/profile', getUserProfile);

// // Route to update the user's profile
// ProfileRoute.put('/profile', updateUserProfile);

// module.exports = ProfileRoute;
const express = require('express');
const Profilerouter = express.Router();
const { getUserProfile, updateUser } = require('../../controller/ProfileController/ProfileController');

Profilerouter.get('/profile', getUserProfile);
Profilerouter.put('/profileupdate', updateUser);
// Profilerouter.delete('/delete', deleteUser);
// Profilerouter.post('/create', createProfile);

module.exports = Profilerouter;
