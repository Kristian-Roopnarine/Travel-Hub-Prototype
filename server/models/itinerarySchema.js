const mongoose = require('mongoose');
const pointSchema = require('./pointSchema');

const itinerarySchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Your itinerary needs a title!'],
  },
  city: {
    type: String,
    required: true,
  },
  location: {
    type: pointSchema,
    required: true,
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Users',
    required: [true, 'Itineraries need an owner.'],
  },
  members: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Users',
    },
  ],
});

// think of logic for joinurl

const Itineraries = mongoose.model('Itineraries', itinerarySchema);

module.exports = Itineraries;
