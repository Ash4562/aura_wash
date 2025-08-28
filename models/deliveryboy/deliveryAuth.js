// const mongoose = require('mongoose');

// const DeliveryboySchema = new mongoose.Schema({
//   shopId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Shop',
//     required: true
//   },
//   Name: String,
//   contactNo: String,
//   email: { type: String, unique: true },
//   AadharNO: String,
//   DrivingLicence: String,
//   otp: String,     
//   otpExpiry: Date,  
//   locations: {
//     latitude: {
//       type: Number,
//       required: false  // make true if always required
//     },
//     longitude: {
//       type: Number,
//       required: false
//     }
//   },
// }, {
//   timestamps: true 
// });

// module.exports = mongoose.model('DeliveryBoy', DeliveryboySchema);

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
  DeliveryBoyProfileImg: String, // <-- Path or URL
  AadharImage: String, // <-- Path or URL
  DrivingLicenceImage: String, // <-- Path or URL
  otp: String,     
  otpExpiry: Date,  
  locations: {
    latitude: {
      type: Number,
      required: false
    },
    longitude: {
      type: Number,
      required: false
    }
  },
}, {
  timestamps: true
});

module.exports = mongoose.model('DeliveryBoy', DeliveryboySchema);
