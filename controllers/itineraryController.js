const jwt = require('jwt');
const Itineraries = require('./../models/itinerarySchema');
const AppError = require('./../utils/appError');
const asyncCatchWrapper = require('./../utils/asyncCatchWrapper');
const appMessages = require('./../applicationMessages.json');
const config = require('./../config');

// create itinerary
exports.createItinerary = asyncCatchWrapper(async (req, res, next) => {
  // need to get user id here
  // from jwt
  const { body } = req;
  const itinerary = await Itineraries.create(body);
  res.send(201).json({
    status: 'created',
    data: itinerary,
  });
});
