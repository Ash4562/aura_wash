
// const User = require("../../models/user/userAuthController");

const userAddress = require("../../models/user/userAddress");


// const userAddress = require("../../models/user/userAddress");



// Create or Add new address for a user
exports.createAddress = async (req, res) => {
  const { userId, name, contactNo, location, city, pincode, email, latitude, longitude } = req.body;

  // Instead of checking latitude/longitude like required fields, allow 0 as valid input too
  if (!userId || !name || !contactNo || !location || !city || !pincode || !email) {
    return res.status(400).json({ error: 'All required fields must be provided' });
  }

  try {
    const address = await userAddress.create({
      user: userId,
      name,
      contactNo,
      location,
      email,
      city,
      pincode,
      locations: {
        latitude: latitude ?? null,   // allow 0, but fallback to null if undefined
        longitude: longitude ?? null
      }
    });

    res.status(201).json({ message: 'Address created successfully', address });
  } catch (err) {
    console.error('Create address error:', err);
    res.status(500).json({ error: 'Failed to create address' });
  }
};


// Get all addresses for a user
exports.getUserAddresses = async (req, res) => {
  const { userId } = req.params;

  try {
    const addresses = await userAddress.find({ user: userId });
    res.status(200).json({ addresses });
  } catch (err) {
    console.error('Fetch addresses error:', err);
    res.status(500).json({ error: 'Failed to fetch addresses' });
  }
};

// get all adress
exports.getAllUsers = async (req, res) => {
    try {
      const users = await userAddress.find().sort({ createdAt: -1 }); // latest first
      res.status(200).json({ users });
    } catch (err) {
      console.error('Get users error:', err);
      res.status(500).json({ error: 'Failed to fetch users' });
    }
  };
// Update an address
// exports.updateAddress = async (req, res) => {
//     const { addressId } = req.params;
//     const {name, contactNo, location, city, pincode , email } = req.body;
  
//     try {
//       const address = await userAddress.findById(addressId);
//       if (!address) return res.status(404).json({ error: 'Address not found' });
  
//       // Optional updates
//       if (name) address.name = name.trim();
//       if (contactNo) address.contactNo = contactNo.trim();
//       if (location) address.location = location.trim();
//       if (email) address.email = email.trim();
//       if (city) address.city = city.trim();
//       if (pincode) address.pincode = pincode.trim();
  
//       await address.save();
//       res.status(200).json({ message: 'Address updated successfully', address });
//     } catch (err) {
//       console.error('Update address error:', err);
//       res.status(500).json({ error: 'Failed to update address' });
//     }
//   };
  
exports.updateAddress = async (req, res) => {
  const { addressId } = req.params;
  const { name, contactNo, location, city, pincode, email, latitude, longitude } = req.body;

  try {
    const address = await userAddress.findById(addressId);
    if (!address) return res.status(404).json({ error: 'Address not found' });

    // Optional updates
    if (name) address.name = name.trim();
    if (contactNo) address.contactNo = contactNo.trim();
    if (location) address.location = location.trim();
    if (email) address.email = email.trim();
    if (city) address.city = city.trim();
    if (pincode) address.pincode = pincode.trim();

    // Update nested location fields if present
    if (latitude !== undefined) address.locations.latitude = latitude;
    if (longitude !== undefined) address.locations.longitude = longitude;

    await address.save();
    res.status(200).json({ message: 'Address updated successfully', address });
  } catch (err) {
    console.error('Update address error:', err);
    res.status(500).json({ error: 'Failed to update address' });
  }
};


// DELETE: Remove an address by ID
exports.deleteAddress = async (req, res) => {
    const { addressId } = req.params;
  
    try {
      const deleted = await userAddress.findByIdAndDelete(addressId);
      if (!deleted) {
        return res.status(404).json({ error: 'Address not found' });
      }
  
      res.status(200).json({ message: 'Address deleted successfully' });
    } catch (err) {
      console.error('Delete address error:', err);
      res.status(500).json({ error: 'Failed to delete address' });
    }
  };
  