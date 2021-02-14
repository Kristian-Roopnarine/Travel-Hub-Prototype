const asyncCatchWrapper = require('./../utils/asyncCatchWrapper');
const AppError = require('./../utils/appError');

exports.deleteOne = (Model) =>
  asyncCatchWrapper(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) {
      return next(new AppError('That document does not exist.', 404));
    }
    res.status(204).json({
      status: 'deleted',
      message: 'The itinerary was removed',
    });
  });
