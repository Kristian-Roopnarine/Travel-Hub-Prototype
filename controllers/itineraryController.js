const Itineraries = require('./../models/itinerarySchema');
const AppError = require('./../utils/appError');
const asyncCatchWrapper = require('./../utils/asyncCatchWrapper');
const itineraryMessages = require('./../appMessages/itinerary.json');
const factory = require('./handlerFactory');

// create itinerary
exports.createItinerary = factory.createOne(Itineraries);
exports.getItinerary = asyncCatchWrapper(async (req, res, next) => {
  const { id } = req.params;
  const itinerary = await Itineraries.findById(id).exec();
  if (!itinerary) {
    const { message, statusCode } = itineraryMessages.doesNotExist;
    return next(new AppError(message, statusCode));
  }
  res.status(200).json({
    data: itinerary,
  });
});

exports.deleteItinerary = factory.deleteOne(Itineraries);

exports.getAllMembers = asyncCatchWrapper(async (req, res, next) => {
  const { id } = req.params;
  const itinerary = await Itineraries.findById(id).exec();
  if (!itinerary) {
    const { message, statusCode } = itineraryMessages.doesNotExist;
    return next(new AppError(message, statusCode));
  }
  console.log(itinerary.members);
  res.status(200).json({
    data: itinerary.members,
  });
});

exports.addMember = asyncCatchWrapper(async (req, res, next) => {
  // first get owner id
  const { id } = req.params;
  const { members } = req.body;
  // this is the itinerary
  const itinerary = await Itineraries.findByIdAndUpdate(
    id,
    { $push: { members: members } },
    { upsert: true, new: true, save: true }
  );

  const { message, statusCode } = itineraryMessages.addMembers.success;

  res.status(statusCode).json({
    status: 'success',
    message,
    data: itinerary,
  });
});

exports.deleteMember = asyncCatchWrapper(async (req, res, next) => {
  // check if user is the owner
  const { id, memId } = req.params;
  // member id is sent
  await Itineraries.findByIdAndUpdate(id, {
    $pull: { members: memId },
  });

  res.status(204).json({
    status: 'deleted',
    data: null,
  });
});
