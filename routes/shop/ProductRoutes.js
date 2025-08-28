const express = require('express');
const router = express.Router();

// const upload = require('../../middleware/multer');
const { createProduct, getProductsByService, updateProduct, deleteProduct } = require('../../controller/shop/ProductController');
const upload = require('../../middleware/multer');

// 🟢 Create Product
router.post('/addproduct', upload.single('image'), createProduct);

// 🔵 Get Products by Service ID
router.get('/service/:serviceId', getProductsByService);

// 🟡 Update Product
router.put('/:productId', upload.single('image'), updateProduct);

// 🔴 Delete Product
router.delete('/:productId', deleteProduct);

module.exports = router;
