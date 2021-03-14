const Cities = require('./../models/citySchema');
const asyncCatchWrapper = require('./../utils/asyncCatchWrapper');
const AppError = require('./../utils/appError');

exports.findCities = asyncCatchWrapper(async (req, res, next) => {
  const { city } = req.params;
  const cities = await Cities.find({
    name: { $regex: city, $options: 'i' },
  })
    .limit(20)
    .exec();
  res.status(200).json({
    status: 'success',
    data: cities,
  });
});
