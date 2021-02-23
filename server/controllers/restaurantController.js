const asyncCatchWrapper = require('./../utils/asyncCatchWrapper');
const factory = require('./handlerFactory');
const Restaurants = require('./../models/restaurantSchema');
const { filterObj } = require('./../utils/filterObj');

exports.createRestaurant = factory.createOne(Restaurants);
exports.deleleteRestaurant = factory.deleteOne(Restaurants);
exports.getRestaurant = factory.getOne(Restaurants);
// TEST THIS
exports.getAllRestaraunts = asyncCatchWrapper(async (req, res, next) => {
  let filter = {};
  if (req.params.itinId) filter = { itinerary: req.params.itinId };
  const restaurants = await Restaurants.find(filter).exec();

  res.status(200).json({
    status: 'success',
    results: restaurants.length,
    data: restaurants,
  });
});

exports.updateRestaurant = asyncCatchWrapper(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'advocate');
  const { id } = req.params;
  const updatedRestaurant = await Restaurants.findByIdAndUpdate(
    id,
    filteredBody,
    {
      new: true,
      runValidators: true,
    }
  );
  res.status(200).json({
    staus: 'success',
    data: updatedRestaurant,
  });
});
