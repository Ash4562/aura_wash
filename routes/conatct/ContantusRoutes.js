
const express = require('express');
const { createContact } = require('../../controller/conatct/Contactuscontroller');
const router = express.Router();


router.post('/add', createContact);


module.exports = router;
