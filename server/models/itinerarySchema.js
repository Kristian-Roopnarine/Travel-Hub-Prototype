const mongoose = require('mongoose');

const itinerarySchema = mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Your itinerary needs a title!'],
  },
  city: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Cities',
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
itinerarySchema.pre(/^find/, function (next) {
  this.populate({
    path: 'creator',
    select: 'firstName',
  })
    .populate('city')
    .populate({
      path: 'members',
      select: 'firstName',
    });
  next();
});

const Itineraries = mongoose.model('Itineraries', itinerarySchema);

module.exports = Itineraries;
