const express = require('express');
const { register, verifyOtp, login, resendOtp, logout, updateUserDetails, getUserDetails, getAllUser, deleteUser } = require('../../controller/user/userAuthController');
const router = express.Router();


// Register with OTP (Step 1 - send OTP)
router.post('/register',register);

// Verify OTP and finalize registration
router.post('/verify-otp',verifyOtp);

// Login with OTP (Step 1 - send OTP)
router.post('/login',login);

// Resend OTP
router.post('/resend-otp',resendOtp);

// Logout
router.post('/logout',logout);
router.put('/update/:userId',updateUserDetails);
router.get('/get/:userId',getUserDetails);
router.get('/getall',getAllUser);
router.delete('/user/:userId',deleteUser);
// Get user details by ID
// router.get('/:userId',getUserDetails);

module.exports = router;
