// routes/orderRoutes.js
const express = require('express');
const { placeOrder, getAllOrders,getOrdersByShopId, getOrderById, assignDeliveryBoy, getOrdersByDeliveryBoy, verifyOrderOTP, assignDeliveryAndComplete, verifyOrderDeliveryOTP, getOrdersByStatus, getOrdersByUserId, getOrdersByUserIdwithOrderStatus } = require('../../controller/user/orderController');
const router = express.Router();
// const orderController = require('../controllers/orderController');

router.post('/place', placeOrder);
router.get('/all', getAllOrders);
router.post('/verify-order-otp/:orderId', verifyOrderOTP);
router.get('/orders/:userId', getOrdersByUserId);
router.get('/getOrdersByUserIdwithOrderStatus/:userId', getOrdersByUserIdwithOrderStatus);
router.put('/assign-delivery/:orderId', assignDeliveryBoy);
router.put('/assign-deliveryboy-completed/:orderId', assignDeliveryAndComplete);
router.post('/verify-delivery-otp/:orderId', verifyOrderDeliveryOTP);
// delivery
router.get('/delivery-boy/:deliveryBoyId', getOrdersByDeliveryBoy);
router.get('/status/:status',getOrdersByStatus);
router.get('/shop/:shopId', getOrdersByShopId);



module.exports = router;
