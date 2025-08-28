const mongoose = require('mongoose');

const PickupSchema = new mongoose.Schema({
  name: { type: String, required: true },
  contact: { type: String, required: true },
  address: { type: String },
  service: { type: String },
  PickupDateTime: { 
    type: String, 
    
  },
  SpecialInstructions:{
    type:String
  }
});

module.exports = mongoose.model('pickup', PickupSchema);
