const Users = require('./../models/userSchema');
const Itineraries = require('./../models/itinerarySchema');
const app = require('./../app');
const request = require('supertest');

exports.addTestUser = async function (
  email = 'bob@gmail.com',
  password = '123'
) {
  return await Users.create({
    firstName: 'bob',
    lastName: 'bob',
    email,
    password,
    passwordConfirm: password,
  });
};

exports.addTestItinerary = async function (email) {
  const user = await Users.findOne({ email: email }).exec();
  return await Itineraries.create({
    title: 'This is a test title',
    creator: user._id,
  });
};

exports.getJWT = async function (email = 'bob@gmail.com', password = '123') {
  return await request(app)
    .post('/api/v1/auth/login')
    .send({ email, password });
};

exports.getItinerary = async function () {
  return await Itineraries.findOne({ title: 'This is a test title' }).exec();
};

exports.getUserByEmail = async function (email) {
  return await Users.findOne({ email }).exec();
};
