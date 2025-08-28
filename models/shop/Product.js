const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  service: { type: mongoose.Schema.Types.ObjectId, ref: 'Service', required: true },
  name: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true }, // Cloudinary/local image path
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
