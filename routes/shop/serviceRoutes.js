const express = require('express');
const router = express.Router();
// const upload = require('../middlewares/upload');

const serviceController = require('../../controller/shop/serviceController');
const upload = require('../../middleware/multer');

router.post('/add', upload.single('image'), serviceController.createService);
router.get('/getall/:shopId', serviceController.getAllServices);
router.get('/getall',serviceController.getAllServicesofAllshop);
router.put('/update/:id', upload.single('image'), serviceController.updateService);
router.delete('/delete/:id', serviceController.deleteService);
router.get('/shops-by-service/:serviceName', serviceController.getShopsByServiceName);
module.exports = router;
