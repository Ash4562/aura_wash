
const jwt = require('jsonwebtoken');
const sendOTP = require('../../utils/sendOTP');
const shopAuthModel = require('../../models/shop/shopAuthModel');
const Service = require('../../models/shop/Service');
const Gallery = require('../../models/shop/Gallery');

const generateOTP = () => Math.floor(1000 + Math.random() * 9000).toString();



// global temp store (or use Redis/DB if production)
const tempRegistrations = new Map(); // key: email, value: { data + otp }


exports.register = async (req, res) => {
  const { ownerName, contactNo, email, shopName, address, description } = req.body;

  // Multer stores the image in req.file
  if (!ownerName || !contactNo || !email || !shopName || !address || !description || !req.file) {
    return res.status(400).json({ error: 'All fields are required including image' });
  }

  try {
    const normalizedEmail = email.toLowerCase().trim();

    // Get image URL from Cloudinary
    const imageUrl = req.file.path;

    const otp = generateOTP();
    const otpExpiry = Date.now() + 5 * 60 * 1000; // 5 minutes

    // Save data temporarily (for OTP verification)
    tempRegistrations.set(normalizedEmail, {
      ownerName: ownerName.trim(),
      contactNo: contactNo.trim(),
      email: normalizedEmail,
      shopName: shopName.trim(),
      address: address.trim(),
      description: description.trim(),
      image: imageUrl,
      otp,
      otpExpiry,
    });

    await sendOTP(normalizedEmail, otp);

    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    console.error('OTP Send Error:', err);
    res.status(500).json({ error: 'Failed to register and send OTP' });
  }
};


exports.login = async (req, res) => {
  const { email } = req.body;
  try {
    const shop = await shopAuthModel.findOne({ email });
    if (!shop) return res.status(404).json({ error: 'Email not found' });

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 5 * 60 * 1000); // 5 mins
    shop.otp = otp;
    shop.otpExpiry = otpExpiry;
    await shop.save();
console.log("otp",otp);
    await sendOTP(email, otp);
    res.status(200).json({ message: 'OTP sent to email' });
  } catch (err) {
    res.status(500).json({ error: 'Login OTP send failed' });
  }
};


exports.verifyOtp = async (req, res) => {
  const { email, otp: inputOtp, isLogin } = req.body;

  if (!email || !inputOtp) {
    return res.status(400).json({ error: 'Email and OTP are required' });
  }

  const normalizedEmail = email.toLowerCase().trim();
  const otp = inputOtp.toString().trim();

  try {
    if (isLogin) {
      // 🔐 LOGIN FLOW
      const shop = await shopAuthModel.findOne({ email: normalizedEmail });
      if (!shop || shop.otp !== otp || new Date() > shop.otpExpiry) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      const token = jwt.sign({ shopId: shop._id }, process.env.JWT_KEY, { expiresIn: '1d' });

      // Clear OTP from DB
      shop.otp = null;
      shop.otpExpiry = null;
      await shop.save();

      return res.status(200).json({ message: 'Login successful', token, shop });
    } else {
      // 📝 REGISTRATION FLOW
      const tempData = tempRegistrations.get(normalizedEmail);

      if (!tempData || tempData.otp !== otp || Date.now() > tempData.otpExpiry) {
        return res.status(400).json({ error: 'Invalid or expired OTP' });
      }

      const alreadyExists = await shopAuthModel.findOne({ email: normalizedEmail });
      if (alreadyExists) {
        return res.status(400).json({ error: 'Email already registered' });
      }

      const newShop = await shopAuthModel.create({
        ownerName: tempData.ownerName,
        contactNo: tempData.contactNo,
        email: normalizedEmail,
        shopName: tempData.shopName,
        address: tempData.address,
        description: tempData.description,
        image: tempData.image,
      });

      // Clean up temp storage
      tempRegistrations.delete(normalizedEmail);

      const token = jwt.sign({ shopId: newShop._id }, process.env.JWT_KEY, { expiresIn: '1d' });

      return res.status(200).json({ message: 'Registration successful', token, shop: newShop });
    }
  } catch (err) {
    console.error('OTP verification error:', err);
    res.status(500).json({ error: 'OTP verification failed' });
  }
};


exports.resendOtp = async (req, res) => {
  const { email } = req.body;
  try {
    const shop = await shopAuthModel.findOne({ email }); // Corrected model name
    if (!shop) return res.status(404).json({ error: 'Email not found' });

    const otp = generateOTP();
    shop.otp = otp;
    shop.otpExpiry = new Date(Date.now() + 5 * 60 * 1000);
    await shop.save();

    await sendOTP(email, otp);
    res.status(200).json({ message: 'OTP resent successfully' });
  } catch (err) {
    res.status(500).json({ error: 'Resend OTP failed' });
  }
};

exports.getShopDetails = async (req, res) => {
  const { shopId } = req.params;

  try {
    const shop = await shopAuthModel.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.status(200).json({ shop });
  } catch (err) {
    console.error('Get shop error:', err);
    res.status(500).json({ error: 'Failed to fetch shop details' });
  }
};

exports.getShopWithServicesGallery = async (req, res) => {
  const { shopId } = req.params;

  try {
    const shop = await shopAuthModel.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    // Fetch services for this shop
    const services = await Service.find({ shopId });

    // Fetch gallery for this shop
    const gallery = await Gallery.find({ shopId });

    res.status(200).json({
      shop,
      services,
      gallery
    });
  } catch (err) {
    console.error('Get shop error:', err);
    res.status(500).json({ error: 'Failed to fetch shop details' });
  }
};


exports.updateShopDetails = async (req, res) => {
  const { shopId } = req.params;
  const {
    ownerName,
    contactNo,
    shopName,
    address,
    description,
  } = req.body;

  try {
    const shop = await shopAuthModel.findById(shopId);
    if (!shop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    // Update fields if provided
    if (ownerName) shop.ownerName = ownerName.trim();
    if (contactNo) shop.contactNo = contactNo.trim();
    if (shopName) shop.shopName = shopName.trim();
    if (address) shop.address = address.trim();
    if (description) shop.description = description.trim();

    // If a new image is uploaded
    if (req.file && req.file.path) {
      shop.image = req.file.path; // Cloudinary or local path via multer
    }

    await shop.save();

    res.status(200).json({ message: 'Shop updated successfully', shop });
  } catch (err) {
    console.error('Update shop error:', err);
    res.status(500).json({ error: 'Failed to update shop' });
  }
};

exports.getAllShops = async (req, res) => {
  try {
    const shops = await shopAuthModel.find().sort({ createdAt: -1 }); // newest first
    res.status(200).json({ shops });
  } catch (err) {
    console.error('Get all shops error:', err);
    res.status(500).json({ error: 'Failed to fetch shops' });
  }
};



exports.deleteShop = async (req, res) => {
  const { shopId } = req.params;

  try {
    const deletedShop = await shopAuthModel.findByIdAndDelete(shopId);

    if (!deletedShop) {
      return res.status(404).json({ error: 'Shop not found' });
    }

    res.status(200).json({ message: 'Shop deleted successfully' });
  } catch (err) {
    console.error('Delete shop error:', err);
    res.status(500).json({ error: 'Failed to delete shop' });
  }
};
