const asyncCatchWrapper = require('./../utils/asyncCatchWrapper');
const AppError = require('./../utils/appError');

exports.createOne = (Model) =>
  asyncCatchWrapper(async (req, res, next) => {
    const { body } = req;
    const doc = await Model.create(body);
    res.status(201).json({
      status: 'created',
      data: doc,
    });
  });

exports.deleteOne = (Model) =>
  asyncCatchWrapper(async (req, res, next) => {
    const { id } = req.params;
    const doc = await Model.findByIdAndDelete(id);
    if (!doc) {
      return next(new AppError('That document does not exist.', 404));
    }
    res.status(204).json({
      status: 'deleted',
      data: null,
    });
  });
