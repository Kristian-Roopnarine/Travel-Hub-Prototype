const mongoose = require('mongoose');
const pointSchema = require('./pointSchema');
require('mongoose-type-url');

// will eventually change depending on AirBnb details

const lodgeSchema = mongoose.Schema({
  itinerary: {
    type: mongoose.Schema.Types.ObjectId,
  },
  name: {
    type: String,
    required: [true, 'Your lodge needs a name'],
  },
  // is this required?
  advocate: {
    type: mongoose.Schema.Types.ObjectId,
    required: true,
  },
  location: {
    type: pointSchema,
    required: true,
  },
  googleMapUrl: mongoose.SchemaTypes.Url,
  website: mongoose.SchemaTypes.Url,
  address: String,
  // reviews?
});

const Lodges = mongoose.model('Lodges', lodgeSchema);

module.exports = Lodges;
