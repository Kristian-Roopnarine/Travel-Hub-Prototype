const { OAuth2Client } = require('google-auth-library');
const config = require('../config');
const client = new OAuth2Client(config.google.client);
const asyncCatchWrapper = require('./../utils/asyncCatchWrapper');

const googleAuth = asyncCatchWrapper(async (token) => {
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: config.google.client,
  });
  const payload = ticket.getPayload();
  const { sub, email, fullName } = payload;
  return { sub, email, fullName };
});

exports.verifyToken = asyncCatchWrapper(async (req, res, next) => {
  const { token } = req.body;
  const userInfo = await googleAuth(token);
  req.user = userInfo;
  next();
});

exports.processInfo = asyncCatchWrapper(async (req, res, next) => {
  const { email } = req.user;
  const user = await Users.findOne({ email }).exec();
  if (!user) {
    const { given_name, family_name } = req.user;
    const newUser = await Users.create({
      email,
      firstName: given_name,
      lastName: family_name,
    });
    req.user = newUser;
  }
  next();
});
