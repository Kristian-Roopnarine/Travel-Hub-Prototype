const express = require('express');
const restaurantRouter = require('./restaurantRoutes');
const lodgeRouter = require('./lodgeRoutes');
const router = express.Router();
const itineraryController = require('./../controllers/itineraryController');
const authController = require('./../controllers/authController');
const itineraryMiddleware = require('./../middleware/itinerary');
const userMiddleware = require('./../middleware/user');

router.use('/:itinId/restaurant', restaurantRouter);
router.use('/:itinId/lodge', lodgeRouter);
router
  .route('/')
  .post(
    authController.protect,
    itineraryMiddleware.setUseridAsCreator,
    itineraryController.createItinerary
  );

router
  .route('/:id')
  .get(authController.protect, itineraryController.getItinerary)
  .delete(
    authController.protect,
    itineraryMiddleware.isOwner,
    itineraryController.deleteItinerary
  );
// fix this nested route eventually
router
  .route('/:id/members')
  .get(authController.protect, itineraryController.getAllMembers)
  .post(
    authController.protect,
    itineraryMiddleware.isOwner,
    itineraryController.addMember
  );

router
  .route('/:id/members/:memId')
  .delete(
    authController.protect,
    itineraryMiddleware.isOwner,
    userMiddleware.userExists,
    itineraryController.deleteMember
  );

module.exports = router;
