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
    const { message, statusCode } = authMessages.login.noEmailOrPass;
    return next(new AppError(message, statusCode));
  }
  const user = await Users.findOne({ email: email }).select('+password');

  if (!user || !(await user.isPasswordCorrect(password, user.password))) {
    const { message, statusCode } = authMessages.login.incorrectCredentials;
    return next(new AppError(message, statusCode));
  }
  createSendToken(user, 200, res);
});

// how am I unit testing this?
// need to test the whether the token is hashed properly
exports.sendPassResetEmail = asyncCatchWrapper(async (req, res, next) => {
  const { email } = req.body;
  // find user
  const user = await Users.findOne({ email: email });
  // if not user
  if (!user) {
    const { message, statusCode } = authMessages.sendResetEmail.userNotFound;
    return next(new AppError(message, statusCode));
  }
  // send response

  // create reset token
  const resetToken = user.createPasswordResetToken();
  await user.save();
  const resetURL = `${req.protocol}://${config.app.url}/reset-password/${resetToken}`;
  // create URL
  // create message
  const message = `You've requested a password reset. Click the link below to create a new password: ${resetURL}. If you did not request a password reset, no need to take further action.`;
  try {
    await sendEmail({
      email: user.email,
      subject: 'Password reset email (valid for 10 minutes)',
      message,
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    const { message, statusCode } = authMessages.sendResetEmail.sendError;
    return next(new AppError(message, statusCode));
  }

  res.status(200).json({
    status: 'success',
    message: 'Password reset token was sent to the email if it exists.',
  });
});

// I have no clue how to unit test this properly!
// should I split this up into different functions/ endpoints and test those separately?
exports.resetPassword = asyncCatchWrapper(async (req, res, next) => {
  const { token } = req.body;
  const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
  const user = await Users.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    const {
      message,
      statusCode,
    } = authMessages.resetPassword.tokenExpiredOrInvalid;
    return next(new AppError(message, statusCode));
  }
  const { password, passwordConfirm } = req.body;
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 200, res);
});

exports.protect = asyncCatchWrapper(async (req, res, next) => {
  // Get token and check if it's there
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    const { message, statusCode } = permissionMessages.jwt.noToken;
    return next(new AppError(message, statusCode));
  }
  // verification
  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  //
  // check if user still exists
  const freshUser = await Users.findById(decoded.id);
  if (!freshUser)
    return next(new AppError('The user does no longer exist.', 401));
  //
  // check if user changed password after the JWT was issued
  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(new AppError('User recently changed password', 401));
  }

  // grant access to protected route
  req.user = freshUser;
  next();
});
