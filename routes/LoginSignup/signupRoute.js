const express = require("express");
const { registerUser, getUserCount, getAllUsers, deleteUser, verifyEmail } = require("../../controller/LoginSignup/signup.controller");

const signupRoute = express.Router();

// Define the POST route
signupRoute.post("/Signup", registerUser);
signupRoute.get("/userscount", getUserCount);
signupRoute.get("/allusers", getAllUsers);
signupRoute.delete("/delete/:id", deleteUser);
signupRoute.post("/verify/email/:token",verifyEmail);

module.exports = { signupRoute };
