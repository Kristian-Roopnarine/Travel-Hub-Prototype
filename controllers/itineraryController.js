const Itineraries = require('./../models/itinerarySchema');
const AppError = require('./../utils/appError');
const asyncCatchWrapper = require('./../utils/asyncCatchWrapper');
const appMessages = require('./../applicationMessages.json');
const config = require('./../config');
const factory = require('./handlerFactory');

// create itinerary
exports.createItinerary = asyncCatchWrapper(async (req, res, next) => {
  const { _id } = req.user;
  const { body } = req;
  const itinerary = await Itineraries.create({ creator: _id, ...body });
  res.status(201).json({
    status: 'created',
    data: itinerary,
  });
});

exports.getItinerary = asyncCatchWrapper(async (req, res, next) => {
  const { id } = req.params;
  const itinerary = await Itineraries.findById(id);
  res.status(200).json({
    data: itinerary,
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
  const {
    message,
    statusCode,
  } = appMessages.itinerary.update.success.addMembers;

  res.status(statusCode).json({
    status: 'success',
    message,
    data: itinerary,
  });
});

exports.deleteItinerary = factory.deleteOne(Itineraries);
