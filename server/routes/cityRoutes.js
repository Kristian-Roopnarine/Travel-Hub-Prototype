const express = require('express');
const router = express.Router();
const cityController = require('./../controllers/cityController');

router.route('/:city').get(cityController.findCities);

module.exports = router;
