const express = require('express');
const placesRouter = require('./placesRoutes');
const lodgeRouter = require('./lodgeRoutes');
const router = express.Router();
const itineraryController = require('./../controllers/itineraryController');
const authController = require('./../controllers/authController');
const itineraryMiddleware = require('./../middleware/itinerary');
const userMiddleware = require('./../middleware/user');
const cityMiddleware = require('./../middleware/cities');

router.use('/:itinId/place', placesRouter);
router.use('/:itinId/lodge', lodgeRouter);
router
  .route('/')
  .post(
    authController.protect,
    cityMiddleware.cityExists,
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
router
  .route('/:id/join')
  .get(
    authController.protect,
    itineraryMiddleware.checkIfCurrentMember,
    itineraryController.addFromUrl
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
