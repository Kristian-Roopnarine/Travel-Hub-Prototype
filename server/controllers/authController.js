const jwt = require('jsonwebtoken');
const { promisify } = require('util');
const AppError = require('./../utils/appError');
const Users = require('./../models/userSchema');
const asyncCatchWrapper = require('./../utils/asyncCatchWrapper');
const crypto = require('crypto');
const authMessages = require('./../appMessages/authentication.json');
const permissionMessages = require('./../appMessages/permissions.json');
const config = require('./../config');
const sendEmail = require('./../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '1d',
  });
};

const createSendToken = (user, statusCode, res) => {
  // change this to redirect to where the url was
  // not always the map
  // or maybe have a home page
  const token = signToken(user._id);
  const cookieOptions = {
    expires: new Date(Date.now() + 1 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  };

  if (process.env.NODE_ENV === 'production') cookieOptions.secure = true;
  res
    .status(statusCode)
    .cookie('jwt', token, cookieOptions)
    .redirect(`${config.app.url}/map`);
};

exports.login = asyncCatchWrapper(async (req, res, next) => {
  const { user } = req;
  if (!user) {
    return next(new AppError('Error during login', 500));
  }
  createSendToken(user, 200, res);
});

exports.protect = asyncCatchWrapper(async (req, res, next) => {
  // Get token and check if it's there
  let token;
  if (req.cookies.jwt) {
    token = req.cookies.jwt;
  }
  /* storing JWT in cookie now 
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  */
  if (!token) {
    const { message, statusCode } = permissionMessages.jwt.noToken;
    return next(new AppError(message, statusCode));
  }
  // verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //
  // check if user still exists
  const freshUser = await Users.findById(decoded.id);
  if (!freshUser) {
    return next(new AppError('The user does no longer exist.', 401));
  }
  // grant access to protected route
  req.user = freshUser;
  next();
});
