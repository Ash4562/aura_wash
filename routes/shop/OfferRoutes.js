const express = require('express');
// const upload = require('../../middlewares/multer');

const upload = require('../../middleware/multer');
const { addoffer, getoffer, updateoffer, deleteoffer, approveOffer, getPendingOffers, getApprovedOffers, getApprovedOffersByShop,  rejectedOffer, addofferbyAdmin, getRejectedOffersByShop, getPendingOffersByShop } = require('../../controller/shop/OfferController');
const router = express.Router();

router.get('/all', getoffer);
router.get('/alloffer', getAlloffer);
router.post('/add', upload.single('image'), addoffer);
router.post('/addOfferByAdmin', upload.single('image'), addofferbyAdmin);
router.put('/approve/:id', approveOffer);
router.put('/rejected/:id', rejectedOffer);
router.get('/pending', getPendingOffers);
router.get('/approved', getApprovedOffers);
router.get('/approved/:shopId', getApprovedOffersByShop);
router.get('/rejected/:shopId', getRejectedOffersByShop);
router.get('/pending/:shopId',getPendingOffersByShop) ;
router.put('/update/:id', upload.single('image'), updateoffer);
router.delete('/delete/:id', deleteoffer);

module.exports = router;
