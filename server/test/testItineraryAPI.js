// make sure to set NODE_ENV=test
//
const config = require('../config');
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const Users = require('./../models/userSchema');
const Cities = require('./../models/citySchema');
const Itineraries = require('./../models/itinerarySchema');
const app = require('./../app');
const authMessages = require('./../appMessages/authentication.json');
const permissionMessages = require('./../appMessages/permissions.json');
const itineraryMessages = require('./../appMessages/itinerary.json');
const userMessages = require('./../appMessages/user.json');
const {
  getJWT,
  addTestUser,
  getUserByEmail,
  getItinerary,
  addTestItinerary,
  addTestCity,
  postWithAuthentication,
  getWithAuthentication,
  deleteWithAuthentication,
} = require('./_helperFunctions');
const mongoose = require('mongoose');

const itineraryApi = '/api/v1/itinerary';
const testTitle = 'This is a test title';
const title = 'This is a title';
const testPoint = {
  type: 'Point',
  coordinates: [-74.006, 40.7128],
};

beforeEach((done) => {
  mongoose.connect(config.db.url, { useNewUrlParser: true }, () => done());
});
afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});
beforeEach((done) => {
  mongoose.connect(config.db.url, { useNewUrlParser: true }, () => done());
});
afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

///////////////////////////////////
// ITINERARY API TESTS
///////////////////////////////////

var token = null;
describe('#ItineraryAPI', function () {
  beforeEach(async function () {
    await Users.deleteMany({});
    await addTestUser();
    await addTestUser('bob2@gmail.com', '123');
    await addTestCity({ name: 'New York', coordinates: testPoint });
    await addTestItinerary('bob@gmail.com');
    token = await getJWT();
  });
  /*
  it('GET / should return all itineraries a user is part of', async function(){
  })
*/
  it('POST / should return 201 on succesful itinerary creation', async function () {
    const city = await Cities.findOne({ name: 'New York' }).exec();
    const response = await postWithAuthentication(`${itineraryApi}`, token, {
      title,
      city: city._id,
    });
    const { data } = response.body;
    expect(data.title).to.equal(title);
    expect(response.status).to.equal(201);
  });

  it('POST / should return 404 when city does not exist', async function () {
    const city = await Cities.findOne({});
  });

  it('GET /:id should return 200 with the itinerary with specified id', async function () {
    const itinerary = await getItinerary();
    const response = await getWithAuthentication(
      `${itineraryApi}/${itinerary._id}`,
      token
    );
    const { data } = response.body;
    expect(response.status).to.equal(200);
    expect(data.title).to.equal(testTitle);
    const city = await Cities.findById(data.city);
    expect(city.name).to.equal('New York');
  });

  it('GET /:id should return 404 when itinerary does not exist', async function () {
    const id = mongoose.Types.ObjectId('zzzzzzzzzzzz');
    const response = await getWithAuthentication(
      `${itineraryApi}/${id}`,
      token
    );
    const { body } = response;
    const { message, statusCode } = itineraryMessages.doesNotExist;
    expect(response.status).to.equal(statusCode);
    expect(body.message).to.equal(message);
  });

  it('DELETE /:id should return 200 after deleting itinerary', async function () {
    const itinerary = await getItinerary();
    const response = await deleteWithAuthentication(
      `${itineraryApi}/${itinerary._id}`,
      token
    );
    expect(response.status).to.equal(204);
  });

  it('DELETE /:id should return 404 when itinerary does not exist', async function () {
    const id = mongoose.Types.ObjectId('zzzzzzzzzzzz');
    const response = await deleteWithAuthentication(
      `${itineraryApi}/${id}`,
      token
    );
    const { body } = response;
    const { message, statusCode } = itineraryMessages.doesNotExist;
    expect(response.status).to.equal(statusCode);
    expect(body.message).to.equal(message);
  });
  it('GET /:id/join should add member to itinerary with :id', async function () {
    await addTestUser('bob2@gmail.com', '1234');
    token = await getJWT('bob2@gmail.com', '1234');
    const itinerary = await getItinerary();
    const response = await getWithAuthentication(
      `${itineraryApi}/${itinerary._id}/join`,
      token
    );
    const { message, data } = response.body;
    expect(response.status).to.equal(200);
    expect(data.members.length).to.equal(1);
    expect(message).to.equal('You have been added to this trip');
  });
  it('GET /:id/join should return 400 if member is already part of trip', async function () {
    await addTestUser('bob2@gmail.com', '1234');
    token = await getJWT('bob2@gmail.com', '1234');
    const itinerary = await getItinerary();
    await getWithAuthentication(`${itineraryApi}/${itinerary._id}/join`, token);
    const response = await getWithAuthentication(
      `${itineraryApi}/${itinerary._id}/join`,
      token
    );
    const { message, data } = response.body;
    expect(response.status).to.equal(400);
    expect(message).to.equal('You are already part of this trip');
  });
  it('GET /:id/join should return 400 if creator makes this requesr', async function () {
    const itinerary = await getItinerary();
    const response = await getWithAuthentication(
      `${itineraryApi}/${itinerary._id}/join`,
      token
    );
    const { message, data } = response.body;
    expect(response.status).to.equal(400);
    expect(message).to.equal('You are already part of this trip');
  });

  it('GET /:id/members returns all members for a specific itinerary', async function () {
    const itinerary = await getItinerary();
    var url = `${itineraryApi}/${itinerary._id}/members`;
    const response = await getWithAuthentication(url, token);
    const { data } = response.body;
    expect(data).to.be.an('array');
    expect(response.status).to.equal(200);
  });
  it('GET /:id/members should return 404 when itinerary does not exist', async function () {
    const id = mongoose.Types.ObjectId('zzzzzzzzzzzz');
    var url = `${itineraryApi}/${id}/members`;
    const response = await getWithAuthentication(url, token);
    const { body } = response;
    const { message, statusCode } = itineraryMessages.doesNotExist;
    expect(response.status).to.equal(statusCode);
    expect(body.message).to.equal(message);
  });

  it('POST /:id/members should return 202 on successfully adding a new member to itinerary', async function () {
    const member = await getUserByEmail('bob2@gmail.com');
    const itinerary = await getItinerary();
    var url = `${itineraryApi}/${itinerary._id}/members`;
    const response = await postWithAuthentication(url, token, {
      members: [member._id],
    });
    const { data } = response.body;
    const { message, statusCode } = itineraryMessages.addMembers.success;
    expect(response.status).to.equal(statusCode);
    expect(response.body.message).to.equal(message);
    expect(data.members.length).to.equal(1);
  });

  it('POST /:id/members should return 202 on successfully adding multiple members to the itinerary', async function () {
    const member = await getUserByEmail('bob2@gmail.com');
    const member2 = await addTestUser(
      (email = 'bob3@gmail.com'),
      (password = '123')
    );
    const member3 = await addTestUser(
      (email = 'bob4@gmail.com'),
      (password = '123')
    );
    const member4 = await addTestUser(
      (email = 'bob5@gmail.com'),
      (password = '123')
    );
    const itinerary = await getItinerary();
    var url = `${itineraryApi}/${itinerary._id}/members`;
    const response = await postWithAuthentication(url, token, {
      members: [member._id, member2._id, member3._id, member4._id],
    });
    const { data } = response.body;
    const { message, statusCode } = itineraryMessages.addMembers.success;
    expect(response.status).to.equal(statusCode);
    expect(response.body.message).to.equal(message);
    expect(data.members.length).to.equal(4);
  });

  it('POST /:id/members should return 404 when itinerary does not exist', async function () {
    const id = mongoose.Types.ObjectId('zzzzzzzzzzzz');
    const member = await getUserByEmail('bob2@gmail.com');
    const response = await postWithAuthentication(
      `${itineraryApi}/${id}/members`,
      token,
      {
        members: [member._id],
      }
    );
    const { body } = response;
    const { message, statusCode } = itineraryMessages.doesNotExist;
    expect(response.status).to.equal(statusCode);
    expect(body.message).to.equal(message);
  });

  it('POST /:id/members should return 401 when unauthorized user tries to add members to itinerary', async function () {
    token = await getJWT('bob2@gmail.com');
    // find the itinerary id to send to the backend
    const itinerary = await getItinerary();
    var url = `${itineraryApi}/${itinerary._id}/members`;
    const { message, statusCode } = permissionMessages.notAuthorized;
    const member = await getUserByEmail('bob@gmail.com');
    const res = await postWithAuthentication(url, token, {
      members: [member._id],
    });
    const { body } = res;
    expect(body.message).to.equal(message);
    expect(res.status).to.equal(statusCode);
  });

  it('DELETE /:id/members/:memId should return 204 when owner successfully deletes a member from the itinerary', async function () {
    const member = await Users.findOne({ email: 'bob2@gmail.com' }).exec();
    const itinerary = await Itineraries.findOne({
      title: 'This is a test title',
    }).exec();
    var url = `${itineraryApi}/${itinerary._id}/members/${member._id}`;
    const response = await deleteWithAuthentication(url, token);
    expect(response.status).to.equal(204);
  });
  it('DELETE /:id/members/:memId should return 404 when itinerary does not exist', async function () {
    const id = mongoose.Types.ObjectId('zzzzzzzzzzzz');
    const member = await getUserByEmail('bob2@gmail.com');
    var url = `${itineraryApi}/${id}/members/${member._id}`;
    const response = await deleteWithAuthentication(url, token);
    const { body } = response;
    const { message, statusCode } = itineraryMessages.doesNotExist;
    expect(response.status).to.equal(statusCode);
    expect(body.message).to.equal(message);
  });
  it('DELETE /:id/members/:memId should return 404 when member does not exist', async function () {
    const itinerary = await getItinerary();
    const id = mongoose.Types.ObjectId('zzzzzzzzzzzz');
    var url = `${itineraryApi}/${itinerary._id}/members/${id}`;
    const response = await deleteWithAuthentication(url, token);
    const { body } = response;
    const { message, statusCode } = userMessages.doesNotExist;
    expect(response.status).to.equal(statusCode);
    expect(body.message).to.equal(message);
  });
});
