const Users = require('./../models/userSchema');
const asyncCatchWrapper = require('./../utils/asyncCatchWrapper');
const AppError = require('./../utils/appError');
const userMessages = require('./../appMessages/user.json');

exports.userExists = asyncCatchWrapper(async (req, res, next) => {
  const { memId } = req.params;
  const doc = await Users.findById(memId).exec();
  if (!doc) {
    const { message, statusCode } = userMessages.doesNotExist;
    return next(new AppError(message, statusCode));
  }
  next();
});
