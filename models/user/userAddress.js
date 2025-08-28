const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  name: { type: String, required: true },
  contactNo: { type: String, required: true },
  location: { type: String, required: true }, // Area / Locality
  email: { type: String, required: true }, // Area / Locality
  city: { type: String, required: true },
  pincode: { type: String, required: true },
  locations: {
    latitude: {
      type: Number,
      required: false  // make true if always required
    },
    longitude: {
      type: Number,
      required: false
    }
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('Address', addressSchema);
