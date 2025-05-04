const jwt = require('jsonwebtoken');
const UserModel = require('../../models/User');

exports.getUserProfile = async (req, res) => {
    try {
        const token = req.cookies.token; // Read token from cookies

        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized' });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey');

        // Fetch user details from the database
        const user = await UserModel.findById(decoded.id).select('-password'); // Exclude password from response

        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }
        res.status(200).json({
            success: true,
            user: {
              id: user._id,
              name: user.name,
              email: user.email,
              phone: user.phone,
              address: user.address,
              profilePicture: user.profilePicture || '',
            },
          });

    } catch (error) {
        console.error('Error fetching user:', error);
        res.status(500).json({ success: false, message: 'Internal server error' });
    }
};

exports.updateUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey');

    const updatedUser = await UserModel.findByIdAndUpdate(decoded.id, req.body, {
      new: true,
      runValidators: true,
    }).select('-password');

    if (!updatedUser) return res.status(404).json({ success: false, message: 'User not found' });

    res.json({ success: true, message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};  

// Delete user account
exports.deleteUser = async (req, res) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.status(401).json({ success: false, message: 'Unauthorized' });

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'defaultSecretKey');

    const user = await UserModel.findByIdAndDelete(decoded.id);

    if (!user) return res.status(404).json({ success: false, message: 'User not found' });

    res.clearCookie('token'); // Optional: clear token cookie
    res.json({ success: true, message: 'User deleted successfully' });
  } catch (error) {
    console.error('Error deleting user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
};

