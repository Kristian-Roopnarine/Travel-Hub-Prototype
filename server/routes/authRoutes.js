const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const passport = require('passport');

router
  .route('/google')
  .get(passport.authenticate('google', { scope: ['profile', 'email'] }));
router
  .route('/google/callback')
  .get(passport.authenticate('google'), authController.login);
module.exports = router;
