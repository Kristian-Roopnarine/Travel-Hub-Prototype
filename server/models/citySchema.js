const mongoose = require('mongoose');
const pointSchema = require('./pointSchema');

const citySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  coordinates: {
    type: pointSchema,
    required: true,
  },
  country: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Countries',
  },
  iso2: String,
  iso3: String,
});

const Cities = mongoose.model('Cities', citySchema);
module.exports = Cities;
