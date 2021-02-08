const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const Users = require('./../models/userSchema');
const asyncCatchWrapper = require('./../utils/asyncCatchWrapper');
const crypto = require('crypto');
const appMessages = require('./../applicationMessages.json');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

const createSendToken = (user, statusCode, res) => {
  const token = signToken(user._id);
  res.status(statusCode).json({
    status: 'success',
    token,
  });
};

exports.signup = asyncCatchWrapper(async (req, res, next) => {
  const { body } = req;
  const data = await Users.create(body);
  createSendToken(data, 201, res);
});

exports.login = asyncCatchWrapper(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    const {
      message,
      statusCode,
    } = appMessages.authentication.login.noEmailOrPass;
    return next(new AppError(message, statusCode));
  }
  const user = await Users.findOne({ email: email }).select('+password');

  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    const {
      message,
      statusCode,
    } = appMessages.authentication.login.incorrectCredentials;
    return next(new AppError(message, statusCode));
  }
  createSendToken(user, 200, res);
});
