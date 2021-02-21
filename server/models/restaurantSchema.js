const mongoose = require('mongoose');
const pointSchema = require('./pointSchema');
require('mongoose-type-url');
const restaurantSchema = mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Your restaraunt needs a name'],
  },
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

const Restaurants = mongoose.model('Restaurants', restaurantSchema);
module.exports = Restaurants;
