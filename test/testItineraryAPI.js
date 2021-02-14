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
const mongoose = require('mongoose');

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
    const response = await request(app)
      .get(`${itineraryApi}/${itinerary._id}`)
      .set('Authorization', 'Bearer ' + token);
    const { data } = response.body;
    expect(response.status).to.equal(200);
    expect(data.title).to.equal('This is a test title');
  });

  it('GET /:id should return 404 when itinerary does not exist', async function () {
    const id = mongoose.Types.ObjectId('zzzzzzzzzzzz');
    const response = await request(app)
      .get(`${itineraryApi}/${id}`)
      .set('Authorization', 'Bearer ' + token);
    const { body } = response;
    const { message, statusCode } = appMessages.itinerary.doesNotExist;
    expect(response.status).to.equal(statusCode);
    expect(body.message).to.equal(message);
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

  it('DELETE /:id should return 404 when itinerary does not exist', async function () {
    const id = mongoose.Types.ObjectId('zzzzzzzzzzzz');
    const response = await request(app)
      .delete(`${itineraryApi}/${id}`)
      .set('Authorization', 'Bearer ' + token);
    const { body } = response;
    const { message, statusCode } = appMessages.itinerary.doesNotExist;
    expect(response.status).to.equal(statusCode);
    expect(body.message).to.equal(message);
  });

  it('GET /:id/members returns all members for a specific itinerary', async function () {
    const itinerary = await Itineraries.findOne({
      title: 'This is a test title',
    }).exec();
    var url = `${itineraryApi}/${itinerary._id}/members`;
    const response = await request(app)
      .get(url)
      .set('Authorization', 'Bearer ' + token);
    const { data } = response.body;
    expect(data).to.be.an('array');
    expect(response.status).to.equal(200);
  });
  it('GET /:id/members should return 404 when itinerary does not exist', async function () {
    const id = mongoose.Types.ObjectId('zzzzzzzzzzzz');
    const response = await request(app)
      .get(`${itineraryApi}/${id}/members`)
      .set('Authorization', 'Bearer ' + token);
    const { body } = response;
    const { message, statusCode } = appMessages.itinerary.doesNotExist;
    expect(response.status).to.equal(statusCode);
    expect(body.message).to.equal(message);
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

  it('POST /:id/members should return 404 when itinerary does not exist', async function () {
    const id = mongoose.Types.ObjectId('zzzzzzzzzzzz');
    const response = await request(app)
      .post(`${itineraryApi}/${id}/members`)
      .set('Authorization', 'Bearer ' + token);
    const { body } = response;
    const { message, statusCode } = appMessages.itinerary.doesNotExist;
    expect(response.status).to.equal(statusCode);
    expect(body.message).to.equal(message);
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

  it('DELETE /:id/members/:memId should return 204 when owner successfully deletes a member from the itinerary', async function () {
    const member = await Users.findOne({ email: 'bob2@gmail.com' }).exec();
    const itinerary = await Itineraries.findOne({
      title: 'This is a test title',
    }).exec();
    var url = `${itineraryApi}/${itinerary._id}/members/${member._id}`;
    await request(app)
      .delete(url)
      .set('Authorization', 'Bearer ' + token)
      .expect(204);
  });
  it('DELETE /:id/members/:memId should return 404 when itinerary does not exist', async function () {
    const id = mongoose.Types.ObjectId('zzzzzzzzzzzz');
    const member = Users.findOne({ email: 'bob2@gmail.com' }).exec();
    const response = await request(app)
      .delete(`${itineraryApi}/${id}/members/${member._id}`)
      .set('Authorization', 'Bearer ' + token);
    const { body } = response;
    const { message, statusCode } = appMessages.itinerary.doesNotExist;
    expect(response.status).to.equal(statusCode);
    expect(body.message).to.equal(message);
  });
  it('DELETE /:id/members/:memId should return 404 when member does not exist', async function () {
    const itinerary = await Itineraries.findOne({
      title: 'This is a test title',
    }).exec();
    const id = mongoose.Types.ObjectId('zzzzzzzzzzzz');
    const response = await request(app)
      .delete(`${itineraryApi}/${itinerary._id}/members/${id}`)
      .set('Authorization', 'Bearer ' + token);
    const { body } = response;
    const { message, statusCode } = appMessages.users.doesNotExist;
    expect(response.status).to.equal(statusCode);
    expect(body.message).to.equal(message);
  });
});
