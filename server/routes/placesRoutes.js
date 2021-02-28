const express = require('express');
const router = express.Router({ mergeParams: true });
const authController = require('./../controllers/authController');
const placesController = require('./../controllers/placesController');
const generalMiddleware = require('./../middleware/general');
router
  .route('/')
  .get(authController.protect, placesController.getAllPlaces)
  .post(
    authController.protect,
    generalMiddleware.setUseridAsAdvocate,
    generalMiddleware.setItineraryParams,
    placesController.createPlace
  );

router
  .route('/:id')
  .get(authController.protect, placesController.getPlace)
  .patch(authController.protect, placesController.updatePlace)
  .delete(authController.protect, placesController.deletePlace);

module.exports = router;
