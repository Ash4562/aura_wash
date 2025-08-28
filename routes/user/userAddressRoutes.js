const express = require('express');
const { createAddress, getUserAddresses, getAllUsers, updateAddress, deleteAddress } = require('../../controller/user/userAddressController');
// const { addAddress, getUserAddresses, updateAddress, deleteAddress, getAllUsers } = require('../../controller/user/userAddressController');
const router = express.Router();
// const userAddressController = require('../user/');

// Add address
router.post('/add',createAddress );

// Get all addresses
router.get('/get/:userId',getUserAddresses);
router.get('/getall',getAllUsers);

// Update address
router.put('/update/:addressId',updateAddress);

// Delete address
router.delete('/delete/:addressId',deleteAddress);

module.exports = router;
