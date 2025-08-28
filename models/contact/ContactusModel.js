const mongoose = require('mongoose');

const ContactusSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { 
    type: String, 
    required: true, 
    // unique: true,
    match: [/^\S+@\S+\.\S+$/, 'Please use a valid email address.']
  },
  contact: { type: String, required: true },
  massage: { type: String },
  address: { type: String }
});

module.exports = mongoose.model('Contactus', ContactusSchema);
