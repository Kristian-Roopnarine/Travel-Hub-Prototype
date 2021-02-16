const asyncCatchWrapper = require('./../utils/asyncCatchWrapper');
const factory = require('./handlerFactory');
const Restaurants = require('./../models/restaurantSchema');

exports.createRestaurant = factory.createOne(Restaurants);
exports.deleleteRestaurant = factory.deleteOne(Restaurants);
exports.getRestaurant = factory.getOne(Restaurants);
