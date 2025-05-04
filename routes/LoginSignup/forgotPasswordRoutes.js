const express = require("express");
const forgotPasswordRouter = express.Router();

const { forgotPassword, pwChange } = require("../../controller/LoginSignup/forgotPassword.controller");

// Forgot Password - sends reset link via email
forgotPasswordRouter.post("/forgot-password", forgotPassword);

// Reset Password - sets new password using token
forgotPasswordRouter.patch("/password-reset/:token", pwChange);

module.exports = forgotPasswordRouter;
    