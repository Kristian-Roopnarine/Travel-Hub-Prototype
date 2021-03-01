const assert = require('assert');
const Lodges = require('./../models/lodgeSchema');
const Users = require('./../models/userSchema');
const app = require('./../app');
const chai = require('chai');
const expect = chai.expect;

const permissionMessages = require('./../appMessages/permissions.json');
const authMessages = require('./../appMessages/authentication.json');
const helpFunc = require('./_helperFunctions');
const mongoose = require('mongoose');

const {
  getJWT,
  addTestUser,
  getItinerary,
  addTestItinerary,
  postWithAuthentication,
  addTestLodge,
  addTestCity,
  getLodge,
  getWithAuthentication,
  deleteWithAuthentication,
  patchWithAuthentication,
} = require('./_helperFunctions');
const baseUrl = '/api/v1';
const lodgeApi = '/api/v1/lodge';
const testLodgePoint = {
  type: 'Point',
  coordinates: [-73.83504, 40.70752],
};
const testPoint = {
  type: 'Point',
  coordinates: [-74.006, 40.7128],
};
const testLodge = {
  name: 'Another Beautiful Home',
  location: testLodgePoint,
  address: '116-25 Metropolitan Ave, Queens, NY 11418',
  website: 'https://testingbeautifulhome.com',
};

var token = null;
describe('# Lodge Api', function () {
  beforeEach(async function () {
    await Users.deleteMany({});
    await addTestUser();
    await addTestLodge('bob@gmail.com');
    token = await getJWT();
  });
  describe('/ ROUTE', function () {
    it('GET should return all lodges without itinerary id in param', async function () {
      const response = await getWithAuthentication(`${lodgeApi}/`, token);
      const { results } = response.body;
      expect(results).to.equal(1);
    });
    it('GET should return all lodges for a itinerary when respective id is provided', async function () {
      await addTestCity({ name: 'New York', coordinates: testPoint });
      await addTestItinerary('bob@gmail.com');
      await addTestLodge('bob@gmail.com', 'This is a test title');
      await addTestLodge('bob@gmail.com', 'This is a test title');
      const itinerary = await getItinerary();
      const response = await getWithAuthentication(
        `${baseUrl}/itinerary/${itinerary._id}/lodge/`,
        token
      );
      const { results, data } = response.body;
      expect(results).to.equal(2);
      // check that the lodge is associated with the correct itinerary
      expect(itinerary._id.equals(data[0].itinerary)).to.equal(true);
    });
    it('GET should return 401 when user not logged in', async function () {
      token = null;
      await addTestCity({ name: 'New York', coordinates: testPoint });
      await addTestItinerary('bob@gmail.com');
      await addTestLodge('bob@gmail.com', 'This is a test title');
      await addTestLodge('bob@gmail.com', 'This is a test title');
      const itinerary = await getItinerary();
      const response = await getWithAuthentication(
        `${baseUrl}/itinerary/${itinerary._id}/lodge/`,
        token
      );
      const { message, statusCode } = permissionMessages.jwt.noToken;
      expect(response.status).to.equal(statusCode);
      expect(response.body.message).to.equal(message);
    });
    it('POST should return 201 on succesfull lodge creation', async function () {
      const response = await postWithAuthentication(
        `${lodgeApi}/`,
        token,
        testLodge
      );
      const { name, location, website, address } = response.body.data;
      expect(name).to.equal(testLodge.name);
      expect(response.status).to.equal(201);
      expect(website).to.equal(testLodge.website);
    });
    it('POST should return 401 when user not logged in', async function () {
      token = null;
      const response = await postWithAuthentication(
        `${lodgeApi}/`,
        token,
        testLodge
      );
      const { message, statusCode } = permissionMessages.jwt.noToken;
      expect(response.status).to.equal(statusCode);
      expect(response.body.message).to.equal(message);
    });
  });
  describe('/:id ROUTE', function () {
    it('GET should return 200 on successfull lodge query', async function () {
      const lodge = await getLodge('Beautiful Home');
      const response = await getWithAuthentication(
        `${lodgeApi}/${lodge._id}`,
        token
      );
      const { name, location, website } = response.body.data;
      expect(response.status).to.equal(200);
      expect(name).to.equal('Beautiful Home');
      expect(website).to.equal('https://testinghome.com');
    });
    it('GET should return 401 when user not logged in', async function () {
      token = null;
      const lodge = await getLodge('Beautiful Home');
      const response = await getWithAuthentication(
        `${lodgeApi}/${lodge._id}`,
        token
      );
      const { message, statusCode } = permissionMessages.jwt.noToken;
      expect(response.status).to.equal(statusCode);
      expect(response.body.message).to.equal(message);
    });
    it('GET should return 404 when lodge could not be found', async function () {
      const id = mongoose.Types.ObjectId('zzzzzzzzzzzz');
      const response = await getWithAuthentication(`${lodgeApi}/${id}`, token);
      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('That document does not exist.');
    });
    it('DELETE should return 204 when deleting a lodge entry', async function () {
      const lodge = await getLodge('Beautiful Home');
      const response = await deleteWithAuthentication(
        `${lodgeApi}/${lodge._id}`,
        token
      );
      expect(response.status).to.equal(204);
    });
    it('DELETE should return 404 when lodge could not be found', async function () {
      const id = mongoose.Types.ObjectId('zzzzzzzzzzzz');
      const response = await deleteWithAuthentication(
        `${lodgeApi}/${id}`,
        token
      );
      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('That document does not exist.');
    });
    it('PATCH should return 200 and updated item when changing a lodge entry', async function () {
      const lodge = await getLodge('Beautiful Home');
      const updatedLodge = { name: 'the name was updated' };
      const response = await patchWithAuthentication(
        `${lodgeApi}/${lodge._id}`,
        token,
        updatedLodge
      );
      const { name, website, address } = response.body.data;
      expect(response.status).to.equal(200);
      expect(name).to.equal(updatedLodge.name);
      expect(website).to.equal(lodge.website);
      expect(address).to.equal(lodge.address);
    });
    it('PATCH should not update advocate even when the property is in req.body', async function () {
      const id = mongoose.Types.ObjectId('zzzzzzzzzzzz');
      const lodge = await getLodge('Beautiful Home');
      const originalUserId = lodge.advocate;
      const updatedLodge = { name: 'the name was updated', advocate: id };
      const response = await patchWithAuthentication(
        `${lodgeApi}/${lodge._id}`,
        token,
        updatedLodge
      );
      const { name, website, address, advocate } = response.body.data;
      assert.strictEqual(originalUserId.equals(advocate), true);
      expect(response.status).to.equal(200);
      expect(name).to.equal(updatedLodge.name);
      expect(website).to.equal(lodge.website);
      expect(address).to.equal(lodge.address);
    });
  });
});
