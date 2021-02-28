const Users = require('./../models/userSchema');
const Itineraries = require('./../models/itinerarySchema');
const asyncCatchWrapper = require('./../utils/asyncCatchWrapper');
const AppError = require('./../utils/appError');
const permissionsMessages = require('./../appMessages/permissions.json');
const itineraryMessages = require('./../appMessages/itinerary.json');

exports.isOwner = asyncCatchWrapper(async (req, res, next) => {
  const { user } = req;
  const { id } = req.params;
  const itinerary = await Itineraries.findById(id).exec();
  if (!itinerary) {
    const { message, statusCode } = itineraryMessages.doesNotExist;
    return next(new AppError(message, statusCode));
  }
  if (!user._id.equals(itinerary.creator)) {
    const { message, statusCode } = permissionsMessages.notAuthorized;
    return next(new AppError(message, statusCode));
  }
  next();
});

exports.setUseridAsCreator = asyncCatchWrapper(async (req, res, next) => {
  const { user } = req;
  req.body.creator = user._id;
  next();
});

exports.checkIfCurrentMember = asyncCatchWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;
  const itinerary = await Itineraries.findById(id).exec();
  const isCreator = itinerary.creator.equals(user._id);
  const isMember = itinerary.members.includes(user._id);
  if (isCreator || isMember) {
    return next(new AppError('You are already part of this trip', 400));
  }
  next();
});
