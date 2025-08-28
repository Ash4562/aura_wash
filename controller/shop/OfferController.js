
const AddOffer = require('../../models/shop/AddOfferr');
const cloudinary = require('../../utils/cloudinary');

// const Banner = require("../../models/adminModel/Banner");

// 📤 Add Banner
exports.addofferbyAdmin = async (req, res) => {
  try {
    const result = await cloudinary.uploader.upload(req.file.path);

    const banner = new AddOffer({
      image: result.secure_url,
      status: "approved" // Status field added here
    });

    await banner.save();

    res.status(201).json({
      success: true,
      message: 'Banner added and approved',
      data: banner
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: err.message
    });
  }
};


exports.addoffer = async (req, res) => {
  try {
    const { shopId } = req.body;

    if (!shopId) {
      return res.status(400).json({ success: false, message: 'shopId is required' });
    }

    const result = await cloudinary.uploader.upload(req.file.path);

    const offer = new AddOffer({
      shopId,
      image: result.secure_url,
      status: 'pending'
    });

    await offer.save();

    res.status(201).json({
      success: true,
      message: 'Offer added with pending status',
      data: offer
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: 'Upload failed',
      error: err.message
    });
  }
};


exports.approveOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await AddOffer.findByIdAndUpdate(
      id,
      { status: 'approved' },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    res.status(200).json({ success: true, message: 'Offer approved', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
exports.rejectedOffer = async (req, res) => {
  try {
    const { id } = req.params;

    const updated = await AddOffer.findByIdAndUpdate(
      id,
      { status: 'rejected' },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Offer not found' });
    }

    res.status(200).json({ success: true, message: 'Offer rejected', data: updated });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
exports.getPendingOffers = async (req, res) => {
  try {
    const pendingOffers = await AddOffer.find({ status: 'pending' }).populate('shopId');
    
    res.status(200).json({ success: true, data: pendingOffers });
  } catch (err) {
    console.error('Error in getPendingOffers:', err);
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};

exports.getApprovedOffers = async (req, res) => {
  try {
    const approvedOffers = await AddOffer.find({ status: 'approved' });
    res.status(200).json({ success: true, data: approvedOffers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};


// 📋 Get All Banners
exports.getoffer = async (req, res) => {
  try {
    const banners = await AddOffer.find().populate('shopId'); // Populate shop data

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

    const updated = await AddOffer.findByIdAndUpdate(
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
    const deleted = await AddOffer.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ success: false, message: 'Banner not found' });
    }

    res.status(200).json({ success: true, message: 'Banner deleted' });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};


exports.getRejectedOffersByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const pendingOffers = await AddOffer.find({ shopId, status: 'rejected' });

    res.status(200).json({ success: true, data: pendingOffers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
exports.getPendingOffersByShop = async (req, res) => {
  try {
    const { shopId } = req.params;

    const offers = await AddOffer.find({ shopId, status: 'pending' });
    if (!offers || offers.length === 0) {
      return res.status(404).json({ success: false, message: "No pending offers found for this shop." });
    }

    res.status(200).json({ success: true, data: offers });
  } catch (error) {
    console.error("getPendingOffersByShop error:", error);
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

exports.getApprovedOffersByShop = async (req, res) => {
  try {
    const { shopId } = req.params;
    const approvedOffers = await AddOffer.find({ shopId, status: 'approved' });

    res.status(200).json({ success: true, data: approvedOffers });
  } catch (err) {
    res.status(500).json({ success: false, message: 'Server error', error: err.message });
  }
};
