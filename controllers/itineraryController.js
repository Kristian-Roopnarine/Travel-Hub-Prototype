const Itineraries = require('./../models/itinerarySchema');
const AppError = require('./../utils/appError');
const asyncCatchWrapper = require('./../utils/asyncCatchWrapper');
const appMessages = require('./../applicationMessages.json');
const config = require('./../config');

// create itinerary
exports.createItinerary = asyncCatchWrapper(async (req, res, next) => {
  const { _id } = req.user;
  console.log({ _id });
  const { body } = req;
  const itinerary = await Itineraries.create({ creator: _id, ...body });
  res.status(201).json({
    status: 'created',
    data: itinerary,
  });
});
