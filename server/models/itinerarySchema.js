const mongoose = require('mongoose');
const crypto = require('crypto');

const itinerarySchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Your itinerary needs a title!'],
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
  joinUrl: String,
});

// think of logic for joinurl

const Itineraries = mongoose.model('Itineraries', itinerarySchema);

module.exports = Itineraries;
