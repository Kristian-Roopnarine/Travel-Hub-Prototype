const mongoose = require('mongoose');

const pointSchema = mongoose.Schema({
  type: {
    type: String,
    enum: ['Point'],
    required: true,
    default: 'Point',
  },
  coordinates: {
    type: [Number],
    required: true,
  },
});

module.exports = pointSchema;
