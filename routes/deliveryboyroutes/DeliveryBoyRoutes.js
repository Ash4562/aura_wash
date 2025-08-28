const express = require('express');
const { register, verifyOtp, login, resendOtp, logout, updateUserDetails, getUserDetails, getAllUser, getDeliveryBoysByShopId, deleteDeliveryBoy } = require('../../controller/deliveryboycontroller/DeliveryBoyController');
const upload = require('../../middleware/multer');
const router = express.Router();


// Register with OTP (Step 1 - send OTP)
// router.post('/register',register);
router.post(
    '/register',
    upload.fields([
      { name: 'AadharImage', maxCount: 1 },
      { name: 'DrivingLicenceImage', maxCount: 1 },
      { name: 'DeliveryBoyProfileImg', maxCount: 1 }
    ]),
    register
  );

// Verify OTP and finalize registration
router.post('/verify-otp',verifyOtp);

// Login with OTP (Step 1 - send OTP)
router.post('/login',login);

// Resend OTP
router.post('/resend-otp',resendOtp);

// Logout
router.post('/logout',logout);
router.put('/update/:deliveryBoyId',updateUserDetails);
router.get('/get/:deliveryBoyId',getUserDetails);
router.get('/getall',getAllUser);
router.get('/shop/:shopId',getDeliveryBoysByShopId);
router.delete('/delivery-boy/:deliveryBoyId', deleteDeliveryBoy);


// Get user details by ID
// router.get('/:userId',getUserDetails);

module.exports = router;
