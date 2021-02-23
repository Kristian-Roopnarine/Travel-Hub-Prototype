const Users = require('./../models/userSchema');
const Itineraries = require('./../models/itinerarySchema');
const app = require('./../app');
const request = require('supertest');
const Restaurants = require('../models/restaurantSchema');
const jwt = require('jsonwebtoken');

exports.postWithAuthentication = async function (url, token, data) {
  return await request(app).post(url).set('Cookie', `jwt=${token}`).send(data);
};

exports.getWithAuthentication = async function (url, token) {
  return await request(app).get(url).set('Cookie', `jwt=${token}`);
};
exports.deleteWithAuthentication = async function (url, token) {
  return await request(app).delete(url).set('Cookie', `jwt=${token}`);
};
exports.patchWithAuthentication = async function (url, token, data) {
  return await request(app).patch(url).set('Cookie', `jwt=${token}`).send(data);
};

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

exports.addTestRestaurant = async function (email) {
  const user = await Users.findOne({ email }).exec();
  const testPoint = {
    type: 'Point',
    coordinates: [-73.83063, 40.70918],
  };
  return await Restaurants.create({
    name: "Dani's house of pizza",
    advocate: user._id,
    location: testPoint,
    website: 'https://danishouseofpizza.com',
    address: '81-28 Lefferts Blvd, Kew Gardens, NY 11415',
  });
};

exports.getJWT = async function (email = 'bob@gmail.com', password = '123') {
  function signToken(id) {
    return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '1d' });
  }
  const user = await Users.findOne({ email }).exec();
  const token = signToken(user._id);
  return token;
};

exports.getItinerary = async function () {
  return await Itineraries.findOne({ title: 'This is a test title' }).exec();
};

exports.getUserByEmail = async function (email) {
  return await Users.findOne({ email }).exec();
};

exports.getRestaurant = async function (name) {
  return await Restaurants.findOne({ name }).exec();
};
