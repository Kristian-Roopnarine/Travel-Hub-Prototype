const asyncCatchWrapper = require('./../utils/asyncCatchWrapper');
const factory = require('./handlerFactory');
const Lodges = require('./../models/lodgeSchema');
const { filterObj } = require('./../utils/filterObj');

exports.createLodge = factory.createOne(Lodges);
exports.deleteLodge = factory.deleteOne(Lodges);
exports.getLodge = factory.getOne(Lodges);
exports.getAllLodges = asyncCatchWrapper(async (req, res, next) => {
  let filter = {};
  if (req.params.itinId) filter = { itinerary: req.params.itinId };
  console.log(req.params.itinId);
  const lodges = await Lodges.find(filter).exec();

  res.status(200).json({
    status: 'success',
    results: lodges.length,
    data: lodges,
  });
});

exports.updateLodge = asyncCatchWrapper(async (req, res, next) => {
  const filteredBody = filterObj(req.body, 'advocate');
  const { id } = req.params;
  const updatedLodge = await Lodges.findByIdAndUpdate(id, filteredBody, {
    new: true,
    runValidators: true,
  });
  res.status(200).json({
    staus: 'success',
    data: updatedLodge,
  });
});
