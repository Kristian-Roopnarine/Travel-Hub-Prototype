const asyncCatchWrapper = require('./../utils/asyncCatchWrapper');
const factory = require('./handlerFactory');
const Places = require('./../models/placesSchema');
const { filterObj } = require('./../utils/filterObj');

exports.createPlace = factory.createOne(Places);
exports.deletePlace = factory.deleteOne(Places);
exports.getPlace = factory.getOne(Places);

// TEST THIS
exports.getAllPlaces = asyncCatchWrapper(async (req, res, next) => {
  let filter = {};

  if (req.params.itinId) filter = { itinerary: req.params.itinId };
  const places = await Places.find(filter).exec();

  res.status(200).json({
    status: 'success',
    results: places.length,
    data: places,
  });
});

exports.updatePlace = asyncCatchWrapper(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'advocate');
  const { id } = req.params;
  const updatedPlace = await Places.findByIdAndUpdate(id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    staus: 'success',
    data: updatedPlace,
  });
});
