const jwt = require('jsonwebtoken');
const User = require('../../models/user/userAuthController');
const sendOTP = require('../../utils/sendOTP');
const userAuthController = require('../../models/user/userAuthController');


const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// Temporary store for registration data
const tempUsers = new Map(); // key: email, value: { userData + otp }

/**
 * Register - Step 1: Store data and send OTP
 */
exports.register = async (req, res) => {
  const { Name, contactNo, email } = req.body;

  if (!Name || !contactNo || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();
    const otp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    tempUsers.set(normalizedEmail, {
      Name: Name.trim(),
      contactNo: contactNo.trim(),
      email: normalizedEmail,
      otp,
      otpExpiry,
    });

    await sendOTP(normalizedEmail, otp);
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('Register error:', err);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

/**
 * Login - Step 1: Generate and send OTP
 */
exports.login = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ error: 'Email not found' });

    const otp = generateOTP();
    user.otp = otp;
    user.otpExpiry = Date.now() + 5 * 60 * 1000;
    await user.save();

    await sendOTP(email, otp);
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ error: 'Login OTP failed' });
  }
};

/**
 * OTP Verification (for both register and login)
 */
exports.verifyOtp = async (req, res) => {
  const { email, otp: inputOtp, isLogin } = req.body;
  const normalizedEmail = email.toLowerCase().trim();
  const otp = inputOtp.toString().trim();

  try {
    if (isLogin) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user || user.otp !== otp || Date.now() > user.otpExpiry) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      user.otp = null;
      user.otpExpiry = null;
      await user.save();

      const token = jwt.sign({ userId: user._id }, process.env.JWT_KEY, { expiresIn: '1d' });
      return res.status(200).json({ message: 'Login successful', token, user });
    } else {
      const tempData = tempUsers.get(normalizedEmail);
      if (!tempData || tempData.otp !== otp || Date.now() > tempData.otpExpiry) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      const alreadyExists = await User.findOne({ email: normalizedEmail });
      if (alreadyExists) return res.status(400).json({ error: 'User already registered' });

      const newUser = await User.create({
        Name: tempData.Name,
        contactNo: tempData.contactNo,
        email: tempData.email,
      });

      tempUsers.delete(normalizedEmail);

      const token = jwt.sign({ userId: newUser._id }, process.env.JWT_KEY, { expiresIn: '1d' });
      return res.status(200).json({ message: 'Registration successful', token, user: newUser });
    }
  } catch (err) {
    console.error('OTP verify error:', err);
    res.status(500).json({ error: 'OTP verification failed' });
  }
};

/**
 * Resend OTP
 */
exports.resendOtp = async (req, res) => {
  const { email, isLogin } = req.body;
  const normalizedEmail = email.toLowerCase().trim();

  try {
    const otp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000;

    if (isLogin) {
      const user = await User.findOne({ email: normalizedEmail });
      if (!user) return res.status(404).json({ error: 'User not found' });

      user.otp = otp;
      user.otpExpiry = otpExpiry;
      await user.save();
    } else {
      const tempData = tempUsers.get(normalizedEmail);
      if (!tempData) return res.status(404).json({ error: 'Please register first' });

      tempData.otp = otp;
      tempData.otpExpiry = otpExpiry;
      tempUsers.set(normalizedEmail, tempData);
    }

    await sendOTP(normalizedEmail, otp);
    res.status(200).json({ message: 'OTP resent successfully' });
  } catch (err) {
    console.error('Resend OTP error:', err);
    res.status(500).json({ error: 'Failed to resend OTP' });
  }
};

/**
 * Logout - (Token removal on frontend, but for server validation, you can store blacklisted tokens or use short expiry)
 */
exports.logout = async (req, res) => {
  // In JWT, logout is handled client-side. If you want to invalidate, use a token blacklist (Redis etc.)
  try {
    // Optional: track token blacklist if needed
    res.status(200).json({ message: 'Logout successful' });
  } catch (err) {
    res.status(500).json({ error: 'Logout failed' });
  }
};


exports.updateUserDetails = async (req, res) => {
  const { userId } = req.params;
  const { Name, contactNo, email } = req.body;

  try {
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // If updating email, ensure it's not taken by another user
    if (email && email.trim().toLowerCase() !== user.email) {
      const existingUser = await User.findOne({ email: email.trim().toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use by another user' });
      }
      user.email = email.trim().toLowerCase();
    }

    if (Name) user.Name = Name.trim();
    if (contactNo) user.contactNo = contactNo.trim();

    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
};
exports.getUserDetails = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({ error: 'Shop not found' });
      }
  
      res.status(200).json({ user });
    } catch (err) {
      console.error('Get user error:', err);
      res.status(500).json({ error: 'Failed to fetch user details' });
    }
  };

  exports.getAllUser= async (req, res) => {
    try {
      const user = await User.find()
       
      res.status(200).json(user);
    } catch (error) {
      console.error('Get orders failed:', error);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  };
  exports.deleteUser = async (req, res) => {
    const { userId } = req.params;
  
    try {
      const deletedUser = await User.findByIdAndDelete(userId);
      
      if (!deletedUser) {
        return res.status(404).json({ error: 'User not found' });
      }
  
      res.status(200).json({ message: 'User deleted successfully' });
    } catch (err) {
      console.error('Delete user error:', err);
      res.status(500).json({ error: 'Failed to delete user' });
    }
  };
  