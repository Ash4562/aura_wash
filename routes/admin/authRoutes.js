const express = require('express');
const { register, verifyOtp, login, resendOtp, logout } = require('../../controller/admin/authcontroller');
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


module.exports = router;
