const express = require('express');
const router = express.Router({ mergeParams: true });

const authController = require('./../controllers/authController');
const lodgeController = require('./../controllers/lodgeController');
const generalMiddleware = require('./../middleware/general');
router
  .route('/')
  .get(authController.protect, lodgeController.getAllLodges)
  .post(
    authController.protect,
    generalMiddleware.setUseridAsAdvocate,
    generalMiddleware.setItineraryParams,
    lodgeController.createLodge
  );

router
  .route('/:id')
  .get(authController.protect, lodgeController.getLodge)
  .patch(authController.protect, lodgeController.updateLodge)
  .delete(authController.protect, lodgeController.deleteLodge);

module.exports = router;
