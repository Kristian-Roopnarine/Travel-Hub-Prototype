const express = require('express');
const router = express.Router();
const itineraryController = require('./../controllers/itineraryController');
const authController = require('./../controllers/authController');

router.post('/', authController.protect, itineraryController.createItinerary);

module.exports = router;
