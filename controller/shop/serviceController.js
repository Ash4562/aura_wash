

const Service = require("../../models/shop/Service");
const shopAuthModel = require("../../models/shop/shopAuthModel");


exports.createService = async (req, res) => {
  try {
    const { name, shopId } = req.body;
    const image = req.file?.path;

    if (!name || !image || !shopId) {
      return res.status(400).json({ message: 'Name, image and shopId are required' });
    }

    const newService = new Service({ name, image, shopId });
    await newService.save();

    res.status(201).json({ message: 'Service created', service: newService });
  } catch (err) {
    res.status(500).json({ error: 'Server error' });
  }
};

exports.getAllServicesofAllshop = async (req, res) => {
  try {
    const services = await Service.find().sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};
exports.getAllServices = async (req, res) => {
  try {
    const { shopId } = req.params;

    if (!shopId) {
      return res.status(400).json({ error: 'Shop ID is required' });
    }

    const services = await Service.find({ shopId }).sort({ createdAt: -1 });
    res.status(200).json(services);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch services' });
  }
};


exports.updateService = async (req, res) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const image = req.file?.path;

    const service = await Service.findById(id);
    if (!service) return res.status(404).json({ message: 'Service not found' });

    if (name) service.name = name;
    if (image) service.image = image;

    await service.save();
    res.status(200).json({ message: 'Service updated', service });
  } catch (err) {
    res.status(500).json({ error: 'Failed to update service' });
  }
};

exports.deleteService = async (req, res) => {
  try {
    const { id } = req.params;
    await Service.findByIdAndDelete(id);
    res.status(200).json({ message: 'Service deleted' });
  } catch (err) {
    res.status(500).json({ error: 'Failed to delete service' });
  }
};

exports.getShopsByServiceName = async (req, res) => {
  try {
    const { serviceName } = req.params;

    if (!serviceName) {
      return res.status(400).json({ error: 'Service name is required' });
    }

    // Step 1: Find all services with that name
    const matchedServices = await Service.find({ name: serviceName });

    if (matchedServices.length === 0) {
      return res.status(404).json({ message: 'No services found with this name' });
    }

    // Step 2: Extract unique shopIds
    const shopIds = [...new Set(matchedServices.map(service => service.shopId))];

    // Step 3: Find all shops with those IDs
    const shops = await shopAuthModel.find({ _id: { $in: shopIds } });

    res.status(200).json({ shops });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};