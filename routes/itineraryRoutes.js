const express = require('express');
const router = express.Router();
const itineraryController = require('./../controllers/itineraryController');
const authController = require('./../controllers/authController');
const itineraryMiddleware = require('./../middleware/itinerary');

router.get('/:id', itineraryController.getItinerary);
router.delete(
  '/:id',
  authController.protect,
  itineraryMiddleware.isOwner,
  itineraryController.deleteItinerary
);
router.post('/', authController.protect, itineraryController.createItinerary);

router.post(
  '/:id/members',
  authController.protect,
  itineraryMiddleware.isOwner,
  itineraryController.addMember
);

module.exports = router;
