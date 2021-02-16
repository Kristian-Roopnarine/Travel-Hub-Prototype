const asyncCatchWrapper = require('./../utils/asyncCatchWrapper');
const factory = require('./handlerFactory');
const Restaurants = require('./../models/restaurantSchema');
const { filterObj } = require('./../utils/filterObj');

exports.createRestaurant = factory.createOne(Restaurants);
exports.deleleteRestaurant = factory.deleteOne(Restaurants);
exports.getRestaurant = factory.getOne(Restaurants);

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
