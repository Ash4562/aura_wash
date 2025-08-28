
const orderModel = require("../../models/user/orderModel");
const User = require('../../models/user/userAuthController');
const sendOTP = require("../../utils/sendOTP");
const mongoose = require('mongoose');
// user side
exports.placeOrder = async (req, res) => {
  try {
    const {
      userId,
      shopId,
      addressId,
      services,
      totalAmount,
      pickupDateTime
    } = req.body;

    // Generate 6-digit OTP
    const otp = Math.floor(1000 + Math.random() * 9000).toString();
    const otpExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 1 day

    const order = new orderModel({
      userId,
      shopId,
      addressId,
      services,
      totalAmount,
      pickupDateTime,
      otp,
      otpExpiresAt
    });

    const savedOrder = await order.save();

    // Send OTP to user's email
    const user = await User.findById(userId);
    if (user?.email) {
      await sendOTP(user.email, otp);
    }

    res.status(201).json({
      message: 'Order placed successfully. OTP sent.',
      order: savedOrder
    });

  } catch (error) {
    console.error('Order creation failed:', error);
    res.status(500).json({ error: 'Failed to place order' });
  }
};
// deliveryboy side 
exports.verifyOrderOTP = async (req, res) => {
  const { orderId } = req.params;
  const { otp } = req.body;

  try {
    const order = await orderModel.findById(orderId);
    if (!order) return res.status(404).json({ error: 'Order not found' });

    if (order.otp !== otp) {
      return res.status(400).json({ error: 'Invalid OTP' });
    }

    if (new Date() > order.otpExpiresAt) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    order.isOtpVerified = true;
    order.orderStatus = 'pickup';
    order.otp = null;
    order.otpExpiresAt = null;

    await order.save();

    res.status(200).json({ message: 'OTP verified, order marked for pickup', order });

  } catch (error) {
    console.error('OTP verification error:', error);
    res.status(500).json({ error: 'OTP verification failed' });
  }
};




// admin side 
exports.getAllOrders = async (req, res) => {
  try {
    const orders = await orderModel.find()
      .populate('userId')
      .populate('addressId')
      .populate('deliveryBoyId') // ✅ yeh correct hai
      .populate({
        path: 'services',
        populate: [
          {
            path: 'serviceId',
            select: 'name' // only name from service
          },
          {
            path: 'products.productId' // full product data if needed
          }
        ]
      });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Get orders failed:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};


  


// user side 


// exports.getOrdersByUserId = async (req, res) => {
//   const { userId } = req.params;

//   // Validate ObjectId format
//   if (!mongoose.Types.ObjectId.isValid(userId)) {
//     return res.status(400).json({ error: 'Invalid userId format' });
//   }

//   try {
//     const orders = await orderModel.find({ userId });

//     if (orders.length === 0) {
//       return res.status(404).json({ message: 'No orders found for this user' });
//     }

//     res.status(200).json({ orders });
//   } catch (error) {
//     console.error('Error fetching orders by userId:', error);
//     res.status(500).json({ error: 'Failed to fetch orders' });
//   }
// };



exports.getOrdersByUserId = async (req, res) => {
  const { userId } = req.params;

  // Validate ObjectId format
  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid userId format' });
  }

  try {
    const orders = await orderModel.find({ userId })
      .populate('shopId', 'shopName contactNo') // Optional: populate shop info
      .populate('addressId') // Optional: populate address
      .populate('services.serviceId', 'name image') // ✅ Populate service details
      .sort({ createdAt: -1 }); // latest first

    if (orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders by userId:', error);
    res.status(500).json({ error: 'Failed to fetch orders' });
  }
};

  // user side 

exports.getOrdersByUserIdwithOrderStatus = async (req, res) => {
  const { userId } = req.params;

  if (!mongoose.Types.ObjectId.isValid(userId)) {
    return res.status(400).json({ error: 'Invalid userId format' });
  }

  try {
    const orders = await orderModel.find({ userId })
      .populate('shopId', 'shopName contactNo')
      .populate('addressId')
      .populate('services.serviceId', 'name image')
      .sort({ createdAt: -1 });

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }

    // Group by orderStatus
    const grouped = {};

    orders.forEach(order => {
      const status = order.orderStatus || 'unknown';
      if (!grouped[status]) {
        grouped[status] = [];
      }
      grouped[status].push(order);
    });

    // Convert to desired array format
    const result = Object.keys(grouped).map(status => ({
      orderStatus: status,
      orders: grouped[status]
    }));

    res.status(200).json(result);
  } catch (error) {
    console.error('Error grouping orders:', error);
    res.status(500).json({ error: 'Failed to fetch grouped orders' });
  }
};

  // shop side 
  exports.assignDeliveryBoy = async (req, res) => { 
    const { orderId } = req.params;
    const { deliveryBoyId } = req.body;
  
    try {
      const order = await orderModel.findById(orderId);
      if (!order) return res.status(404).json({ error: 'Order not found' });
  
      order.deliveryBoyId = deliveryBoyId;
      order.orderStatus = 'pickup';
      await order.save();
  
      res.status(200).json({ message: 'Delivery boy assigned', order });
    } catch (error) {
      console.error('Assign delivery boy error:', error);
      res.status(500).json({ error: 'Failed to assign delivery boy' });
    }
  };
  // shop side 
  exports.assignDeliveryAndComplete = async (req, res) => {
    const { orderId } = req.params;
    const { deliveryBoyId } = req.body;
  
    try {
      const order = await orderModel.findById(orderId).populate('userId');
      if (!order) return res.status(404).json({ error: 'Order not found' });
  
      const user = order.userId;
      if (!user.email) return res.status(400).json({ error: 'User email not found' });
  
      // Generate OTP valid for 24 hours
      const otp = Math.floor(1000 + Math.random() * 9000);
      const otpExpiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours
  
      order.deliveryBoyId = deliveryBoyId;
      order.otp = otp;
      order.otpExpiresAt = otpExpiresAt;
      order.orderStatus = 'completed'; // directly mark as completed
      await order.save();
  
      // Send OTP to user's email
      await sendOTP(user.email, otp);
  
      res.status(200).json({
        message: 'Delivery boy assigned, OTP sent to user, and order marked as completed',
        order
      });
  
    } catch (error) {
      console.error('Assign delivery error:', error);
      res.status(500).json({ error: 'Failed to assign delivery and send OTP' });
    }
  };
  exports.verifyOrderDeliveryOTP = async (req, res) => {
    const { orderId } = req.params;
    const { otp } = req.body;
  
    try {
      const order = await orderModel.findById(orderId);
      if (!order) return res.status(404).json({ error: 'Order not found' });
  
      if (!order.otp || !order.otpExpiresAt) {
        return res.status(400).json({ error: 'No OTP found for this order' });
      }
  
      // Check OTP match
      if (order.otp !== otp) {
        return res.status(400).json({ error: 'Invalid OTP' });
      }
  
      // Check expiry
      if (new Date() > order.otpExpiresAt) {
        return res.status(400).json({ error: 'OTP has expired' });
      }
  
      // Mark as delivered
      order.isOtpVerified = true;
      order.orderStatus = 'delivered'; // or 'completed' if that's your status
      order.otp = null;
      order.otpExpiresAt = null;
  
      await order.save();
  
      res.status(200).json({
        message: 'OTP verified successfully. Order marked as delivered.',
        order
      });
  
    } catch (error) {
      console.error('OTP verification failed:', error);
      res.status(500).json({ error: 'OTP verification failed' });
    }
  };
  // delivery side 
  exports.getOrdersByDeliveryBoy = async (req, res) => {
    try {
      const { deliveryBoyId } = req.params;
  
      const orders = await orderModel
        .find({ deliveryBoyId })
        .populate('userId', 'name contactNo')  // optional: populate user info
        .populate('addressId')
        .populate('shopId')
        .populate('services.serviceId')
        .populate('services.products.productId');
  
      if (orders.length === 0) {
        return res.status(404).json({ message: 'No orders assigned to this delivery boy' });
      }
  
      res.status(200).json({ orders });
    } catch (error) {
      console.error('Error fetching delivery boy orders:', error);
      res.status(500).json({ error: 'Failed to fetch orders' });
    }
  };
  
  // Common for all (admin/shop/delivery if required by status)
exports.getOrdersByStatus = async (req, res) => {
  const { status } = req.params;

  try {
    const orders = await orderModel.find({ orderStatus: status })
      .populate('userId', 'name contactNo')
      .populate('addressId')
      .populate('shopId')
      .populate('services.serviceId')
      .populate('services.products.productId');

    if (orders.length === 0) {
      return res.status(404).json({ message: `No orders with status "${status}" found.` });
    }

    res.status(200).json({ orders });
  } catch (error) {
    console.error('Error fetching orders by status:', error);
    res.status(500).json({ error: 'Failed to fetch orders by status' });
  }
};


exports.getOrdersByShopId = async (req, res) => {
  try {
    const { shopId } = req.params;

    // Validate shopId format
    if (!shopId.match(/^[0-9a-fA-F]{24}$/)) {
      return res.status(400).json({ message: 'Invalid shopId format' });
    }

    const orders = await orderModel.find({ shopId })
      .populate('userId', 'name contactNo') // optional
      .populate('addressId') // optional
      .populate('services.serviceId', 'name') // if services contain serviceId
      .sort({ createdAt: -1 }); // latest first

    if (!orders.length) {
      return res.status(404).json({ message: 'No orders found for this shop' });
    }

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error fetching orders by shopId:', error);
    res.status(500).json({ message: 'Server error', error });
  }
};
