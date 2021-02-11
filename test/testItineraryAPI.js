// make sure to set NODE_ENV=test
const config = require('../config');
const request = require('supertest');
const chai = require('chai');
const mongoose = require('mongoose');
const Users = require('./../models/userSchema');
const Itineraries = require('./../models/itinerarySchema');
const app = require('./../app');
const appMessages = require('./../applicationMessages.json');
const itineraryApi = '/api/v1/itinerary';
async function addTestUser() {
  return await Users.create({
    firstName: 'bob',
    lastName: 'bob',
    email: 'bob@gmail.com',
    password: '123',
    passwordConfirm: '123',
  });
}
var token = null;
describe('#ItineraryAPI', function () {
  beforeEach(async function () {
    await Users.deleteMany({});
    await addTestUser();
    const loginInfo = { email: 'bob@gmail.com', password: '123' };
    const response = await request(app)
      .post('/api/v1/auth/login')
      .send(loginInfo);
    token = response.body.token;
  });

  it('POST / should return 201 on succesful itinerary creation', function (done) {
    request(app)
      .post(`${itineraryApi}/`)
      .set('Authorization', 'Bearer ' + token)
      .send({ title: 'This is a test' })
      .expect(201, done);
  });
});
