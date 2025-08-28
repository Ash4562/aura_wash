const express = require('express');
// const upload = require('../../middlewares/multer');

const upload = require('../../middleware/multer');
const { addoffer, getoffer, updateoffer, deleteoffer, getAllOffersAllshop } = require('../../controller/shop/GalleryController');
// const { addoffer, getoffer, updateoffer, deleteoffer } = require('../../controller/shop/OfferController');
const router = express.Router();


router.post('/add', upload.single('image'), addoffer);

router.get('/getall', getAllOffersAllshop);
router.get('/getall/:shopId', getoffer);
router.put('/update/:id', upload.single('image'), updateoffer);
router.delete('/delete/:id', deleteoffer);
module.exports = router;
