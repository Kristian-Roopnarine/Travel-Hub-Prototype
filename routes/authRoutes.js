const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');

router.post('/login', authController.login);
router.post('/signup', authController.signup);
router.post('/password-reset-email', authController.sendPassResetEmail);
router.post('/reset-password', authController.resetPassword);

module.exports = router;
