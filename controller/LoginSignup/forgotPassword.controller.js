const UserModel = require("../../models/User")
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs');
const {passwordResetMail, sendForgotPasswordMail }= require('../../utils/forgetPasswordmail')

//forgot password
const forgotPassword = async(req,res) => {
    // console.log(req.body)
    try{
  
      const {email} = req.body
  
      if(!email){
        return res.status(404).json({success:false, message:"Email not found"})
        
      }
  
      const findEmail = await UserModel.findOne({
        email:email
      })
  
      if(!findEmail){
        return res.status(404).json({success:false, message:"User not found"})
      }
  
      //rest link send
  
      //generating token
      const token = jwt.sign({id:findEmail._id}, process.env.JWT_SECRET, {expiresIn:'5m'});
  
      //sendingmail
      sendForgotPasswordMail(findEmail.email, token)
      res.status(200).json({success:true, message: "Verification link has been sent to your email", token})
  
  
      
  
    }catch(error){
      res.status(500).json({success:false, message:"server error", error: error.message})
    }
  }
  
  //forgot password- change
  const pwChange = async(req, res) => {
    try{
      const {password} =req.body;
      const {token} = req.params;
  
      if(!password && !token){
        res.status(400).json({sucess:false, message:"All fields are required"})
      }
  
      //verifying token
      const decoded= jwt.verify(token,process.env.JWT_SECRET);
  
      if(!decoded){
        res.status(400).json({sucess:false, message:"invalid token"})
      }
  
      const userId= decoded.id;
  
      const existingUser = await UserModel.findById(userId);
  
      if(!existingUser){
        res.status(400).json({sucess:false, message:"User not found"})
      }
  
      const hashedPassword = bcrypt.hashSync(password,10)
  
      existingUser.password = hashedPassword;
  
      await existingUser.save();
      res.status(200).json({success:true, message: "Password reset successfully"})
  
    } catch (error) {
        res.status(500).json({ success: false, message: "Server error", error: error.message });
      }
  }

  module.exports = {forgotPassword,pwChange}