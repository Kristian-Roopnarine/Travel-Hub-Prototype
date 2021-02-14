// make sure to set NODE_ENV=test
//
const config = require('../config');
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const Users = require('./../models/userSchema');
const Itineraries = require('./../models/itinerarySchema');
const app = require('./../app');
const appMessages = require('./../applicationMessages.json');
const helpFunc = require('./_helperFunctions');

const itineraryApi = '/api/v1/itinerary';

var token = null;
describe('#ItineraryAPI', function () {
  beforeEach(async function () {
    await Users.deleteMany({});
    await helpFunc.addTestUser();
    await helpFunc.addTestUser('bob2@gmail.com', '123');
    await helpFunc.addTestItinerary('bob@gmail.com');
    const response = await helpFunc.getJWT();
    token = response.body.token;
  });
  /*
  it('GET / should return all itineraries a user is part of', async function(){
  })
*/
  it('POST / should return 201 on succesful itinerary creation', async function () {
    const response = await request(app)
      .post(`${itineraryApi}/`)
      .set('Authorization', 'Bearer ' + token)
      .send({ title: 'This is a test' });
    const { data } = response.body;
    expect(data.title).to.equal('This is a test');
    expect(response.status).to.equal(201);
  });

  it('GET /:id should return 200 with the itinerary with specified id', async function () {
    const itinerary = await Itineraries.findOne({
      title: 'This is a test title',
    }).exec();
    const response = await request(app).get(`${itineraryApi}/${itinerary._id}`);
    const { data } = response.body;
    expect(response.status).to.equal(200);
    expect(data.title).to.equal('This is a test title');
  });

  it('DELETE /:id should return 200 after deleting itinerary', async function () {
    const itinerary = await Itineraries.findOne({
      title: 'This is a test title',
    }).exec();
    await request(app)
      .delete(`${itineraryApi}/${itinerary._id}`)
      .set('Authorization', 'Bearer ' + token)
      .expect(204);
  });

  it('POST /:id/members should return 2022 on successfully adding a new member to itinerary', async function () {
    const member = await Users.findOne({ email: 'bob2@gmail.com' }).exec();
    const itinerary = await Itineraries.findOne({
      title: 'This is a test title',
    }).exec();
    const {
      message,
      statusCode,
    } = appMessages.itinerary.update.success.addMembers;
    var url = `${itineraryApi}/${itinerary._id}/members`;
    const response = await request(app)
      .post(url)
      .set('Authorization', 'Bearer ' + token)
      .send({ members: [member._id] });
    const { data } = response.body;
    expect(response.status).to.equal(statusCode);
    expect(response.body.message).to.equal(message);
    expect(data.members.length).to.equal(1);
  });

  it('POST /:id/members should return 401 when unauthorized user tries to add members to itinerary', async function () {
    const response = await helpFunc.getJWT('bob2@gmail.com', '123');
    token = response.body.token;
    // find the itinerary id to send to the backend
    const itinerary = await Itineraries.findOne({
      title: 'This is a test title',
    }).exec();
    var url = `${itineraryApi}/${itinerary._id}/members`;
    const {
      message,
      statusCode,
    } = appMessages.itinerary.permissions.notAuthorized;
    await request(app)
      .post(url)
      .set('Authorization', 'Bearer ' + token)
      .expect(statusCode, { status: 'fail', message: message });
  });
});
