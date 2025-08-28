const mongoose = require('mongoose');

const DeliveryboySchema = new mongoose.Schema({
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  Name: String,
  contactNo: String,
  email: { type: String, unique: true },
  AadharNO: String,
  DrivingLicence: String,
  otp: String,     
  otpExpiry: Date,  
}, {
  timestamps: true 
});

module.exports = mongoose.model('DeliveryBoy', DeliveryboySchema);