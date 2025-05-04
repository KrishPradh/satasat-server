// LOGOUT USER
const logoutUser = (req, res) => {
    res.clearCookie('token', {
      httpOnly: true,
      sameSite: 'Lax', 
      secure: false, 
    });
  
    return res.status(200).json({ success: true, message: 'Logged out successfully' });
  };
  
  module.exports = {
    logoutUser,
  };
  