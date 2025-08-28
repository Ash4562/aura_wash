
const express = require('express');
const { Pickup } = require('../../controller/conatct/LaundryPickupController');

const router = express.Router();


router.post('/add', Pickup);


module.exports = router;
