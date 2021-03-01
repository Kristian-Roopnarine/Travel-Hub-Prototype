const mongoose = require('mongoose');

const countrySchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
});

const Countries = mongoose.model('Countries', countrySchema);
module.exports = Countries;
