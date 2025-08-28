// const Banner = require('../../models/adminModel/Banner');
const AddOfferr = require('../../models/shop/AddOfferr');
const cloudinary = require('../../utils/cloudinary');

// const Banner = require("../../models/adminModel/Banner");

// 📤 Add Banner
exports.addoffer = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);
    const banner = new AddOfferr({ image: result.secure_url });

    await banner.save();
    res.status(201).json({ success: true, message: 'Banner added', data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Upload failed', error: err.message });
  }
};

// 📋 Get All Banners
exports.getoffer = async (req, res) => {
  try {
    const banners = await AddOfferr.find();
    res.status(200).json({ success: true, data: banners });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 🖊️ Update Banner
exports.updateoffer = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await cloudinary.uploader.upload(req.file.path);

    const updated = await AddOfferr.findByIdAndUpdate(
      id,
      { image: result.secure_url },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    res.status(200).json({ success: true, message: 'Banner updated', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

// 🗑️ Delete Banner
exports.deleteoffer = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await AddOfferr.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    res.status(200).json({ success: true, message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
