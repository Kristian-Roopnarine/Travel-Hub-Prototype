const Users = require('./../models/userSchema');
const Itineraries = require('./../models/itinerarySchema');
const app = require('./../app');
const request = require('supertest');
const Places = require('../models/placesSchema');
const Lodges = require('../models/lodgeSchema');
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
  const testPoint = {
    type: 'Point',
    coordinates: [-74.006, 40.7128],
  };
  return await Itineraries.create({
    title: 'This is a test title',
    creator: user._id,
    city: 'New York',
    location: testPoint,
  });
};

exports.addTestPlace = async function (
  email,
  category = 'restaurant',
  itinerary_title = null
) {
  const user = await Users.findOne({ email }).exec();
  const testPoint = {
    type: 'Point',
    coordinates: [-73.83063, 40.70918],
  };
  let data = {
    name: "Dani's house of pizza",
    advocate: user._id,
    location: testPoint,
    website: 'https://danishouseofpizza.com',
    address: '81-28 Lefferts Blvd, Kew Gardens, NY 11415',
    category,
  };
  if (itinerary_title) {
    const it = await Itineraries.findOne({
      title: itinerary_title,
    }).exec();
    data = { ...data, itinerary: it._id };
  }
  return await Places.create(data);
};
exports.addTestLodge = async function (email, itinerary_title = null) {
  const user = await Users.findOne({ email }).exec();
  const testPoint = {
    type: 'Point',
    coordinates: [-73.83063, 40.70918],
  };
  let data = {
    name: 'Beautiful Home',
    advocate: user._id,
    location: testPoint,
    website: 'https://testinghome.com',
    address: '81-28 Lefferts Blvd, Kew Gardens, NY 11415',
  };
  if (itinerary_title) {
    const it = await Itineraries.findOne({
      title: itinerary_title,
    }).exec();
    data = { ...data, itinerary: it._id };
  }
  return await Lodges.create(data);
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

exports.getPlaces = async function (name) {
  return await Places.findOne({ name }).exec();
};

exports.getLodge = async function (name) {
  return await Lodges.findOne({ name }).exec();
};
