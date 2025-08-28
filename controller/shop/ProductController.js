

// const Product = require("../../routes/shop/Product");

const Product = require("../../models/shop/Product");



exports.createProduct = async (req, res) => {
  try {
    const { serviceId, name, price } = req.body;
    if (!serviceId || !name || !price || !req.file) {
      return res.status(400).json({ error: 'All fields are required' });
    }

    const newProduct = await Product.create({
      service: serviceId,
      name: name.trim(),
      price: parseFloat(price),
      image: req.file.path,
    });

    res.status(201).json({ message: 'Product created', product: newProduct });
  } 
  catch (err) {
    console.error('Product creation error:', err); // 👈 helpful debug log
    res.status(500).json({ error: 'Failed to create product' });
  }
  
};

exports.getProductsByService = async (req, res) => {
  try {
    const { serviceId } = req.params;
    const products = await Product.find({ service: serviceId }).sort({ createdAt: -1 });
    res.status(200).json({ products });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
};

exports.updateProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    const { name, price } = req.body;

    const product = await Product.findById(productId);
    if (!product) return res.status(404).json({ error: 'Product not found' });

    if (name) product.name = name.trim();
    if (price) product.price = parseFloat(price);
    if (req.file && req.file.path) product.image = req.file.path;

    await product.save();

    res.status(200).json({ message: 'Product updated', product });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update product' });
  }
};

exports.deleteProduct = async (req, res) => {
  try {
    const { productId } = req.params;
    await Product.findByIdAndDelete(productId);
    res.status(200).json({ message: 'Product deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
};
