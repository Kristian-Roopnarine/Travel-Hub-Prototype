const express = require('express');
const router = express.Router({ mergeParams: true });
const authController = require('./../controllers/authController');
const restaurantController = require('./../controllers/restaurantController');
const restaurantMiddleware = require('./../middleware/restaurant');
router
  .route('/')
  .get(authController.protect, restaurantController.getAllRestaraunts)
  .post(
    authController.protect,
    restaurantMiddleware.setUseridAsAdvocate,
    restaurantMiddleware.setItineraryParams,
    restaurantController.createRestaurant
  );

router
  .route('/:id')
  .get(authController.protect, restaurantController.getRestaurant)
  .patch(authController.protect, restaurantController.updateRestaurant)
  .delete(authController.protect, restaurantController.deleleteRestaurant);

module.exports = router;
