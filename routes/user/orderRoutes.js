// routes/orderRoutes.js
const express = require('express');
const { placeOrder, getAllOrders,getOrdersByShopId, getOrderById, assignDeliveryBoy, getOrdersByDeliveryBoy, verifyOrderOTP, assignDeliveryAndComplete, verifyOrderDeliveryOTP, getOrdersByStatus, getOrdersByUserId, getOrdersByUserIdwithOrderStatus, rejectOrderByDeliveryBoy, getRejectedOrdersByDeliveryBoy, getCompletedOrdersByDeliveryBoy, getTotelbalanceAmount } = require('../../controller/user/orderController');
const router = express.Router();
// const orderController = require('../controllers/orderController');

router.post('/place', placeOrder);
router.get('/all', getAllOrders);
router.get('/orders/:userId', getOrdersByUserId);
router.get('/getTotelbalanceAmount/:userId', getTotelbalanceAmount);
router.get('/getOrdersByUserIdwithOrderStatus/:userId', getOrdersByUserIdwithOrderStatus);
router.put('/assign-delivery/:orderId', assignDeliveryBoy);
router.get('/delivery-boy/:deliveryBoyId', getOrdersByDeliveryBoy);
// delivery
router.get('/status/:status',getOrdersByStatus);
router.get('/shop/:shopId', getOrdersByShopId);
router.post('/verify-order-otp/:orderId', verifyOrderOTP);
router.post('/verify-delivery-otp/:orderId', verifyOrderDeliveryOTP);
router.put('/assign-deliveryboy-completed/:orderId', assignDeliveryAndComplete);
router.put('/orderRejectByDeliveryBoy/:orderId', rejectOrderByDeliveryBoy);
router.get('/rejected-orders/:deliveryBoyId', getRejectedOrdersByDeliveryBoy);
router.get('/completed-orders/:deliveryBoyId', getCompletedOrdersByDeliveryBoy);


module.exports = router;
