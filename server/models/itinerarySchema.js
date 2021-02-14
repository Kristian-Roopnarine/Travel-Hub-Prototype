const mongoose = require('mongoose');

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
});

const Itineraries = mongoose.model('Itineraries', itinerarySchema);

module.exports = Itineraries;
