const jwt = require('jsonwebtoken');

const sendOTP = require('../../utils/sendOTP');
const Delivery = require('../../models/deliveryboy/deliveryAuth');



const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();

// Temporary store for registration data
const tempUsers = new Map(); // key: email, value: { userData + otp }








exports.registerDriver = async (req, res) => {
  try {
    const {
      Name,
      email,
      address,
      contactNo,
      VehicleType,
      VehicleName,
      VehicleNumber,
      RCbookNumber,
      DrivingLicenceNo,
      IDProofNo,
      latitude,
      longitude
    } = req.body;

    const {
      DrivingLicenceImage,
      RCbookImage,
      ProfileImage,
      IDProofImage
    } = req.files;

    // ✅ Basic validation (optional but recommended)
    if (!email || !contactNo || !ProfileImage) {
      return res.status(400).json({ error: 'Required fields missing' });
    }

    // ✅ Check for existing driver
    const existing = await DriverAuth.findOne({ email });
    if (existing) {
      return res.status(400).json({ error: 'Driver already registered with this email' });
    }

    // ✅ Create driver entry
    const newDriver = new DriverAuth({
      Name,
      email,
      address,
      contactNo,
      VehicleType,
      VehicleName,
      VehicleNumber,
      RCbookNumber,
      DrivingLicenceNo,
      IDProofNo,

      DrivingLicenceImage: DrivingLicenceImage?.[0]?.path || null,
      RCbookImage: RCbookImage?.[0]?.path || null,
      ProfileImage: ProfileImage?.[0]?.path || null,
      IDProofImage: IDProofImage?.[0]?.path || null,

      locations: {
        latitude: latitude ? parseFloat(latitude) : undefined,
        longitude: longitude ? parseFloat(longitude) : undefined
      },
    });

    await newDriver.save();

    res.status(201).json({
      message: 'Driver registered successfully',
      driver: newDriver
    });
  } catch (error) {
    console.error('Driver registration failed:', error);
    res.status(500).json({ error: 'Registration failed' });
  }
};














// exports.register = async (req, res) => {
//   const { Name, contactNo, email, shopId, AadharNO, DrivingLicence, latitude, longitude } = req.body;

//   if (!Name || !contactNo || !email || !shopId) {
//     return res.status(400).json({ error: 'All required fields are not provided' });
//   }

//   try {
//     const normalizedEmail = email.toLowerCase().trim();
//     const otp = generateOTP();
//     const otpExpiry = Date.now() + 5 * 60 * 1000;

//     const AadharImage = req.files?.AadharImage?.[0]?.path || null;
//     const DrivingLicenceImage = req.files?.DrivingLicenceImage?.[0]?.path || null;
//     const DeliveryBoyProfileImg = req.files?.DeliveryBoyProfileImg?.[0]?.path || null;

//     tempUsers.set(normalizedEmail, {
//       Name: Name.trim(),
//       contactNo: contactNo.trim(),
//       email: normalizedEmail,
//       AadharNO: AadharNO?.trim(),
//       DrivingLicence: DrivingLicence?.trim(),
//       AadharImage,
//       DrivingLicenceImage,
//       DeliveryBoyProfileImg,
//       shopId: shopId.trim(),
//       locations: {
//         latitude: latitude ? parseFloat(latitude) : null,
//         longitude: longitude ? parseFloat(longitude) : null
//       },
//       otp,
//       otpExpiry,
//     });

//     await sendOTP(normalizedEmail, otp);
//     res.status(200).json({ message: 'OTP sent to email' });
//   } catch (err) {
//     console.error('Register error:', err);
//     res.status(500).json({ error: 'Failed to send OTP' });
//   }
// };








/**
 * Login - Step 1: Generate and send OTP
 */
exports.login = async (req, res) => {
  const { email } = req.body;
  try {
    const user = await Delivery.findOne({ email });
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
      const user = await Delivery.findOne({ email: normalizedEmail });
      if (!user || user.otp !== otp || Date.now() > user.otpExpiry) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      user.otp = null;
      user.otpExpiry = null;
      await user.save();

      const token = jwt.sign({ DeliveryId: user._id }, process.env.JWT_KEY, { expiresIn: '1d' });
      return res.status(200).json({ message: 'Login successful', token, user });
    } else {
      const tempData = tempUsers.get(normalizedEmail);
      if (!tempData || tempData.otp !== otp || Date.now() > tempData.otpExpiry) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      const alreadyExists = await Delivery.findOne({ email: normalizedEmail });
      if (alreadyExists) return res.status(400).json({ error: 'User already registered' });

      const newUser = await Delivery.create({
        Name: tempData.Name,
        contactNo: tempData.contactNo,
        email: tempData.email,
        shopId: tempData.shopId, 
        DrivingLicence: tempData.DrivingLicence, 
        AadharNO: tempData.AadharNO, 
        AadharImage: tempData.AadharImage || null,
        DrivingLicenceImage: tempData.DrivingLicenceImage || null,
        DeliveryBoyProfileImg: tempData.DeliveryBoyProfileImg || null,
        locations: {
          latitude: tempData.locations?.latitude || null,
          longitude: tempData.locations?.longitude || null
        }
      });

      tempUsers.delete(normalizedEmail);

      const token = jwt.sign({ DeliveryId: newUser._id }, process.env.JWT_KEY, { expiresIn: '1d' });
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
      const user = await Delivery.findOne({ email: normalizedEmail });
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
  const { deliveryBoyId } = req.params;
  const {Name, contactNo, email,AadharNO,DrivingLicence  } = req.body;

  try {
    const user = await Delivery.findById(deliveryBoyId);
    if (!user) return res.status(404).json({ error: 'User not found' });

    // If updating email, ensure it's not taken by another user
    if (email && email.trim().toLowerCase() !== user.email) {
      const existingUser = await Delivery.findOne({ email: email.trim().toLowerCase() });
      if (existingUser) {
        return res.status(400).json({ error: 'Email already in use by another user' });
      }
      user.email = email.trim().toLowerCase();
    }

    if (Name) user.Name = Name.trim();
    if (contactNo) user.contactNo = contactNo.trim();
    if (AadharNO) user.AadharNO = AadharNO.trim();
    if (DrivingLicence) user.DrivingLicence = DrivingLicence.trim();
    // if (contactNo) user.contactNo = contactNo.trim();

    await user.save();

    res.status(200).json({ message: 'User updated successfully', user });
  } catch (err) {
    console.error('Update user error:', err);
    res.status(500).json({ error: 'Failed to update user' });
  }
};
exports.getUserDetails = async (req, res) => {
    const { deliveryBoyId } = req.params;
  
    try {
      const user = await Delivery.findById(deliveryBoyId);
      if (!user) {
        return res.status(404).json({ error: 'Shop not found' });
      }
  
      res.status(200).json({ user });
    } catch (err) {
      console.error('Get user error:', err);
      res.status(500).json({ error: 'Failed to fetch user details' });
    }
  };

  exports.getAllUser = async (req, res) => {
    try {
      const user = await Delivery.find().populate("shopId");
      res.status(200).json(user);
    } catch (error) {
      console.error('Get orders failed:', error);
      res.status(500).json({ error: 'Failed to fetch Deliveryoy' });
    }
  };
exports.getDeliveryBoysByShopId = async (req, res) => {
  try {
    const { shopId } = req.params;

    if (!shopId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid shopId format' });
    }

    // Find delivery boys and populate shop details
    const deliveryBoys = await Delivery.find({ shopId })
      .populate('shopId', 'shopName address contactNo'); // yahan shop ke fields specify karo jo chahiye

    if (!deliveryBoys.length) {
      return res.status(404).json({ message: 'No delivery boys found for this shop' });
    }

    res.status(200).json(deliveryBoys);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error', error });
  }
};
  
exports.deleteDeliveryBoy = async (req, res) => {
  const { deliveryBoyId } = req.params;

  try {
    const deletedUser = await Delivery.findByIdAndDelete(deliveryBoyId);

    if (!deletedUser) {
      return res.status(404).json({ message: 'Delivery boy not found' });
    }

    res.status(200).json({ message: 'Delivery boy deleted successfully' });
  } catch (error) {
    console.error('Delete error:', error);
    res.status(500).json({ message: 'Failed to delete delivery boy', error });
  }
};
