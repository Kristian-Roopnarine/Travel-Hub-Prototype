const mongoose = require('mongoose');
const pointSchema = require('./pointSchema');
require('mongoose-type-url');

const placesSchema = mongoose.Schema({
  itinerary: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Itineraries',
  },
  name: {
    type: String,
    required: [true, 'Your restaraunt needs a name'],
  },
  advocate: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: true,
  },
  location: {
    type: pointSchema,
    required: true,
  },
  googleMapUrl: mongoose.SchemaTypes.Url,
  website: mongoose.SchemaTypes.Url,
  address: String,
  category: {
    type: String,
    enum: ['restaurant', 'tourist_attraction'],
  },
});

const Places = mongoose.model('Places', placesSchema);
module.exports = Places;
