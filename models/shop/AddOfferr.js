// const mongoose = require('mongoose');

// const offerSchema = new mongoose.Schema({
//   image: {
//     type: String,
//     required: true,
//   },
// }, { timestamps: true });

// module.exports = mongoose.model('Offer', offerSchema);
// models/shop/AddOfferr.js
const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',

  },
  image: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'approved',"rejected"],
    default: 'pending',
  },
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);
