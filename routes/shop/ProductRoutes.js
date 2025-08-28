const express = require('express');
const router = express.Router();

// const upload = require('../../middleware/multer');
const { createProduct, getProductsByService, deleteProductById, updateProductById, createOnlySubcategory, deleteSubcategories } = require('../../controller/shop/ProductController');
const upload = require('../../middleware/multer');

// 🟢 Create Product
router.post('/addproduct', upload.single('image'), createProduct);
router.post('/createOnlySubcategory', upload.single('image'), createOnlySubcategory);

// 🔵 Get Products by Service ID
router.get('/service/:serviceId', getProductsByService);

// 🟡 Update Product
router.put('/:productId', upload.single('image'), updateProductById);

// 🔴 Delete Product
router.delete('/:productId', deleteProductById);
router.delete('/subcategories/:subcategoriesId', deleteSubcategories);

module.exports = router;
