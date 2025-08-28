const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  shopId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Shop',
    required: true
  },
  addressId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Address',
    required: true
  },
  services: [
    {
      serviceId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Service'
      },
      products: [
        {
          productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product'
          },
          productName: String,
          quantity: Number,
          price: Number,
          total: Number
        }
      ]
    }
  ],
  totalAmount: {
    type: Number,
    required: true
  },
  paidAmount: {
    type: Number,
    default: 0
  },
  balanceAmount: {
    type: Number,
    default: 0
  },
  pickupDateTime: {
    type: String, // or Date
    required: true
  },

  otp: {
    type: String,
    default: null,
  },
  isOtpVerified: {
    type: Boolean,
    default: false,
  },
  otpExpiresAt: {
    type: Date,
    default: null,
  },
  deliveryBoyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'DeliveryBoy', // or 'DeliveryBoy' if you have a separate model
    default: null
  },
  orderStatus: {
    type: String,
    enum: ['pending', 'ongoing', 'pickup', 'washing', 'completed', 'delivered','orderRejectByDeliveryBoy','rejected'],
    default: 'pending'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Order', orderSchema);
