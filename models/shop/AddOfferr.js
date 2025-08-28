const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
  image: {
    type: String,
    required: true,
  },
}, { timestamps: true });

module.exports = mongoose.model('Offer', offerSchema);
