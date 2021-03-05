const Itineraries = require('./../models/itinerarySchema');
const Users = require('./../models/userSchema');
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

exports.getAllItineraries = asyncCatchWrapper(async (req, res, next) => {
  const { user } = req;
  const itineraries = await Itineraries.find({
    $or: [{ creator: user._id }, { members: { $in: [user._id] } }],
  })
    .populate({
      path: 'creator',
      select: 'firstName',
    })
    .populate('city')
    .populate({
      path: 'members',
      select: 'firstName',
    })
    .exec();
  res.status(200).json({
    status: 'success',
    data: itineraries,
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
  res.status(200).json({
    data: itinerary.members,
  });
});

exports.addMember = asyncCatchWrapper(async (req, res, next) => {
  // first get owner id
  const { id } = req.params;
  const { members } = req.body;
  // this is the itinerary
  for (const member of members) {
    let mem = await Users.findById(member).exec();
    if (!mem) {
      const { message, statusCode } = itineraryMessages.addMembers.fail;
      return next(new AppError(message, statusCode));
    }
  }
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
exports.addFromUrl = asyncCatchWrapper(async (req, res, next) => {
  const { id } = req.params;
  const { user } = req;
  const itinerary = await Itineraries.findByIdAndUpdate(
    id,
    { $push: { members: user._id } },
    { upsert: true, new: true, save: true }
  );
  res.status(200).json({
    status: 'success',
    data: itinerary,
    message: 'You have been added to this trip',
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
