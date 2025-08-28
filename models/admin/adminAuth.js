const mongoose = require('mongoose');

const adminSchema = new mongoose.Schema({
  Name: String,
  contactNo: String,
  email: { type: String, unique: true },
  otp: String,     
  otpExpiry: Date,  
}, {
  timestamps: true 
});

module.exports = mongoose.model('Admin', adminSchema);