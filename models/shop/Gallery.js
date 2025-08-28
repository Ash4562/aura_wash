

// const mongoose = require('mongoose');

// const GallerySchema = new mongoose.Schema({
//   image: {
//     type: String,
//     required: true,
//   },
// }, { timestamps: true });

// module.exports = mongoose.model('gallery', GallerySchema);
const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('gallery', gallerySchema);
