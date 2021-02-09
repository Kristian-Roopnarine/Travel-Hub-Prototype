const jwt = require('jsonwebtoken');
const AppError = require('./../utils/appError');
const Users = require('./../models/userSchema');
const asyncCatchWrapper = require('./../utils/asyncCatchWrapper');
const crypto = require('crypto');
const appMessages = require('./../applicationMessages.json');
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

// how am I unit testing this?
// need to test the whether the token is hashed properly
exports.sendPassResetEmail = asyncCatchWrapper(async (req, res, next) => {
  const { email } = req.body;
  // find user
  const user = await Users.findOne({ email: email });
  // if not user
  if (!user)
    return next(new AppError('User with that email does not exist', 404));
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
    console.log(err);
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save();
    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
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
  const user = await Users.find({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });
  if (!user) {
    return next(new AppError('Token is invalid or expired', 400));
  }
  const { password, passwordConfirm } = req.body;
  user.password = password;
  user.passwordConfirm = passwordConfirm;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;
  await user.save();
  createSendToken(user, 200, res);
});
