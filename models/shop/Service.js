// const mongoose = require('mongoose');

// const serviceSchema = new mongoose.Schema({
//   name: { type: String, required: true },
//   image: { type: String, required: true }, // store Cloudinary URL or file path
// }, { timestamps: true });

// module.exports = mongoose.model('Service', serviceSchema);
const mongoose = require('mongoose');

const serviceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  image: { type: String, required: true }, // Cloudinary URL or file path
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Service', serviceSchema);
