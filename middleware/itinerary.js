const Users = require('./../models/userSchema');
const Itineraries = require('./../models/itinerarySchema');
const asyncCatchWrapper = require('./../utils/asyncCatchWrapper');
const AppError = require('./../utils/appError');
const appMessages = require('./../applicationMessages.json');

exports.isOwner = asyncCatchWrapper(async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  const itinerary = await Itineraries.findById(id).exec();
  if (!itinerary) {
    const { message, statusCode } = appMessages.itinerary.doesNotExist;
    return next(new AppError(message, statusCode));
  }
  if (!user._id.equals(itinerary.creator)) {
    const {
      message,
      statusCode,
    } = appMessages.itinerary.permissions.notAuthorized;
    return next(new AppError(message, statusCode));
  }
  next();
});

exports.setUseridAsCreator = asyncCatchWrapper(async (req, res, next) => {
  const { user } = req;
  req.body.creator = user._id;
  next();
});
