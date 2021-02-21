const asyncCatchWrapper = require('./../utils/asyncCatchWrapper');
exports.setUseridAsAdvocate = asyncCatchWrapper(async (req, res, next) => {
  const { user } = req;
  req.body.advocate = user._id;
  next();
});
