const Users = require('./../models/userSchema');
const Itineraries = require('./../models/itinerarySchema');
const asyncCatchWrapper = require('./../utils/asyncCatchWrapper');
const AppError = require('./../utils/appError');
const appMessages = require('./../applicationMessages.json');

exports.isOwner = asyncCatchWrapper(async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  const itinerary = await Itineraries.findOne({
    creator: user._id,
    _id: id,
  }).exec();
  if (!itinerary) {
    const {
      message,
      statusCode,
    } = appMessages.itinerary.permissions.notAuthorized;
    return next(new AppError(message, statusCode));
  }
  next();
});
