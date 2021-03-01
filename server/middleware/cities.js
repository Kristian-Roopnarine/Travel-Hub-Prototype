const Cities = require('./../models/citySchema');
const asyncCatchWrapper = require('./../utils/asyncCatchWrapper');
const AppError = require('./../utils/appError');

exports.cityExists = asyncCatchWrapper(async (req, res, next) => {
  const { city } = req.body;
  const cityExists = await Cities.findById(city).exec();
  if (!cityExists) {
    return next(new AppError('Error finding city.', 404));
  }
  next();
});
