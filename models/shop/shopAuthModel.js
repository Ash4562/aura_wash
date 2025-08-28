const mongoose = require('mongoose');

const shopSchema = new mongoose.Schema({
  ownerName: String,
  contactNo: String,
  email: { type: String, unique: true },
  shopName: String,
  address: String,
  description: String,
  image: String,
  otp: String,       // Should be String
  otpExpiry: Date,  
}, {
  timestamps: true 
});

module.exports = mongoose.model('Shop', shopSchema);