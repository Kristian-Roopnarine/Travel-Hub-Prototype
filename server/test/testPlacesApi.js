const assert = require('assert');
const Places = require('./../models/placesSchema');
const Users = require('./../models/userSchema');
const app = require('./../app');
const chai = require('chai');
const expect = chai.expect;

const permissionMessages = require('./../appMessages/permissions.json');
const authMessages = require('./../appMessages/authentication.json');
const helpFunc = require('./_helperFunctions');
const mongoose = require('mongoose');

const {
  getPlaces,
  getJWT,
  addTestUser,
  getUserByEmail,
  getItinerary,
  addTestItinerary,
  addTestCity,
  postWithAuthentication,
  addTestPlace,
  getWithAuthentication,
  deleteWithAuthentication,
  patchWithAuthentication,
} = require('./_helperFunctions');
const baseUrl = '/api/v1';
const placeApi = '/api/v1/place';
const testPlacePoint = {
  type: 'Point',
  coordinates: [-73.83504, 40.70752],
};
const testPlace = {
  name: "Spolini's",
  location: testPlacePoint,
  address: '116-25 Metropolitan Ave, Queens, NY 11418',
  website: 'https://spolinismenu.com',
  category: 'restaurant',
};
const testPoint = {
  type: 'Point',
  coordinates: [-74.006, 40.7128],
};

var token = null;
describe('# Places Api', function () {
  beforeEach(async function () {
    await Users.deleteMany({});
    await addTestUser();
    await addTestPlace('bob@gmail.com');
    token = await getJWT();
  });
  describe('/ ROUTE', function () {
    it('GET should return all restaraunts without itinerary id in param', async function () {
      const response = await getWithAuthentication(`${placeApi}/`, token);
      const { results } = response.body;
      expect(results).to.equal(1);
    });
    it('GET should return all places for a itinerary when respective id is provided', async function () {
      await addTestCity({ name: 'New York', coordinates: testPoint });
      await addTestItinerary('bob@gmail.com');
      await addTestPlace('bob@gmail.com', 'restaurant', 'This is a test title');
      await addTestPlace(
        'bob@gmail.com',
        'tourist_attraction',
        'This is a test title'
      );
      const itinerary = await getItinerary();
      const response = await getWithAuthentication(
        `${baseUrl}/itinerary/${itinerary._id}/place/`,
        token
      );
      const { results, data } = response.body;
      expect(results).to.equal(2);
      // check that the place is associated with the correct itinerary
      expect(itinerary._id.equals(data[0].itinerary)).to.equal(true);
    });
    it('GET should return 401 when user not logged in', async function () {
      await addTestCity({ name: 'New York', coordinates: testPoint });
      await addTestItinerary('bob@gmail.com');
      await addTestPlace('bob@gmail.com', 'restaurant', 'This is a test title');
      await addTestPlace(
        'bob@gmail.com',
        'tourist_attraction',
        'This is a test title'
      );
      const itinerary = await getItinerary();
      token = null;
      const response = await getWithAuthentication(
        `${baseUrl}/itinerary/${itinerary._id}/place/`,
        token
      );
      const { message, statusCode } = permissionMessages.jwt.noToken;
      expect(response.status).to.equal(statusCode);
      expect(response.body.message).to.equal(message);
    });
    it('POST should return 201 on succesfull restaurant creation', async function () {
      const response = await postWithAuthentication(
        `${placeApi}/`,
        token,
        testPlace
      );
      const { name, location, website, address, category } = response.body.data;
      expect(name).to.equal(testPlace.name);
      expect(response.status).to.equal(201);
      expect(website).to.equal(testPlace.website);
      expect(category).to.equal('restaurant');
    });

    it('POST should return 201 on succesfull tourist attraction creation', async function () {
      let testAttraction = testPlace;
      testAttraction.category = 'tourist_attraction';
      const response = await postWithAuthentication(
        `${placeApi}/`,
        token,
        testAttraction
      );
      const { name, location, website, address, category } = response.body.data;
      expect(name).to.equal(testAttraction.name);
      expect(response.status).to.equal(201);
      expect(website).to.equal(testAttraction.website);
      expect(category).to.equal('tourist_attraction');
    });
    it('POST should return 401 when user not logged in', async function () {
      token = null;
      const response = await postWithAuthentication(
        `${placeApi}/`,
        token,
        testPlace
      );
      const { message, statusCode } = permissionMessages.jwt.noToken;
      expect(response.status).to.equal(statusCode);
      expect(response.body.message).to.equal(message);
    });
  });
  describe('/:id ROUTE', function () {
    it('GET should return 200 on successfull place query', async function () {
      const place = await getPlaces("Dani's house of pizza");
      const response = await getWithAuthentication(
        `${placeApi}/${place._id}`,
        token
      );
      const { name, location, website } = response.body.data;
      expect(response.status).to.equal(200);
      expect(name).to.equal("Dani's house of pizza");
      expect(website).to.equal('https://danishouseofpizza.com');
    });
    it('GET should return 404 when place does not exist', async function () {
      const id = mongoose.Types.ObjectId('zzzzzzzzzzzz');
      const response = await getWithAuthentication(`${placeApi}/${id}`, token);
      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('That document does not exist.');
    });
    it('GET should return 401 when user not logged in', async function () {
      token = null;
      const place = await getPlaces("Dani's house of pizza");
      const response = await getWithAuthentication(
        `${placeApi}/${place._id}`,
        token
      );
      const { message, statusCode } = permissionMessages.jwt.noToken;
      expect(response.status).to.equal(statusCode);
      expect(response.body.message).to.equal(message);
    });
    it('DELETE should return 204 when deleting a place entry', async function () {
      const place = await getPlaces("Dani's house of pizza");
      const response = await deleteWithAuthentication(
        `${placeApi}/${place._id}`,
        token
      );
      expect(response.status).to.equal(204);
    });
    it('DELETE should return 404 when place does not exist', async function () {
      const id = mongoose.Types.ObjectId('zzzzzzzzzzzz');
      const response = await deleteWithAuthentication(
        `${placeApi}/${id}`,
        token
      );
      expect(response.status).to.equal(404);
      expect(response.body.message).to.equal('That document does not exist.');
    });
    it('DELETE should return 401 when user not logged in', async function () {
      token = null;
      const place = await getPlaces("Dani's house of pizza");
      const response = await deleteWithAuthentication(
        `${placeApi}/${place._id}`,
        token
      );
      const { message, statusCode } = permissionMessages.jwt.noToken;
      expect(response.status).to.equal(statusCode);
      expect(response.body.message).to.equal(message);
    });
    it('PATCH should return 200 and updated item when changing a place entry', async function () {
      const place = await getPlaces("Dani's house of pizza");
      const updatedPlace = { name: 'the name was updated' };
      const response = await patchWithAuthentication(
        `${placeApi}/${place._id}`,
        token,
        updatedPlace
      );
      const { name, website, address } = response.body.data;
      expect(response.status).to.equal(200);
      expect(name).to.equal(updatedPlace.name);
      expect(website).to.equal(place.website);
      expect(address).to.equal(place.address);
    });
    it('PATCH should not update advocate even when the property is in req.body', async function () {
      const id = mongoose.Types.ObjectId('zzzzzzzzzzzz');
      const place = await getPlaces("Dani's house of pizza");
      const originalUserId = place.advocate;
      const updatedPlace = { name: 'the name was updated', advocate: id };
      const response = await patchWithAuthentication(
        `${placeApi}/${place._id}`,
        token,
        updatedPlace
      );
      const { name, website, address, advocate } = response.body.data;
      assert.strictEqual(originalUserId.equals(advocate), true);
      expect(response.status).to.equal(200);
      expect(name).to.equal(updatedPlace.name);
      expect(website).to.equal(place.website);
      expect(address).to.equal(place.address);
    });
  });
});
