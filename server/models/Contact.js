const mongoose = require('mongoose');

// Define the Contact schema
const contactSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true, // Name is required
    unique: true // Name must be unique
  },
  number: {
    type: String,
    required: true // Number is required
  }
});

// Set schema options (if any)
contactSchema.set('toJSON', {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id; // Remove _id field from JSON
    delete returnedObject.__v; // Remove __v field from JSON
  }
});

// Create the model and export it
module.exports = mongoose.model('Contact', contactSchema);
