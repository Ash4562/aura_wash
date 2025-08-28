

const Gallery = require('../../models/shop/Gallery');
const cloudinary = require('../../utils/cloudinary');


// 📤 Add Banner
exports.addoffer = async (req, res) => {
  try {
    const { shopId } = req.body;
    if (!shopId) {
      return res.status(400).json({ success: false, message: 'Shop ID is required' });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const banner = new Gallery({
      image: result.secure_url,
      shopId: shopId,
    });

    await banner.save();
    res.status(201).json({ success: true, message: 'Banner added', data: banner });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Upload failed', error: err.message });
  }
};


// 📋 Get All Banners
exports.getoffer = async (req, res) => {
  try {
    const { shopId } = req.params;
    console.log();
    if (!shopId) {
      return res.status(400).json({ success: false, message: 'Shop ID is required' });
    }

    const banners = await Gallery.find({ shopId });
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

    const updated = await Gallery.findByIdAndUpdate(
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
    const deleted = await Gallery.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    res.status(200).json({ success: true, message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getAllOffersAllshop = async (req, res) => {
  try {
    const banners = await Gallery.find().sort({ createdAt: -1 });
    res.status(200).json({ success: true, data: banners });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};