// routes/authRoutes.js
const express = require('express');
const router = express.Router();
const authController = require('../../controller/shop/shopAuthcontroller');
const upload = require('../../middleware/multer');

// router.post('/register', authController.register)

router.post('/register', upload.single('image'), authController.register)
.post('/login', authController.login)
.post('/verify-login-otp',authController.verifyOtp)
.post('/resend-otp', authController.resendOtp)
.get('/get/:shopId', authController.getShopDetails)
.get('/getShopServicesGallerys/:shopId', authController.getShopWithServicesGallery)
.get('/shops', authController.getAllShops)
.put('/update/:shopId', upload.single('image'), authController.updateShopDetails)
.delete('/delete/:shopId', authController.deleteShop);
module.exports = router;
