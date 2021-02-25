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
    it('DELETE should return 204 when deleting a lodge entry', async function () {
      const lodge = await getLodge('Beautiful Home');
      const response = await deleteWithAuthentication(
        `${lodgeApi}/${lodge._id}`,
        token
      );
      expect(response.status).to.equal(204);
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
