const express = require('express');
const router = express.Router();
const itineraryController = require('./../controllers/itineraryController');
const authController = require('./../controllers/authController');
const itineraryMiddleware = require('./../middleware/itinerary');
const userMiddleware = require('./../middleware/user');
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
