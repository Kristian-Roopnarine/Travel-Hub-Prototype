const asyncCatchWrapper = require('./../utils/asyncCatchWrapper');

exports.setUseridAsAdvocate = asyncCatchWrapper(async (req, res, next) => {
  const { user } = req;
  req.body.advocate = user._id;
  next();
});

exports.setItineraryParams = asyncCatchWrapper(async (req, res, next) => {
  if (req.params.itinId) req.body.itinerary = req.params.itinId;
  next();
});
