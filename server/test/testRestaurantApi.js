const assert = require('assert');
const Restaurants = require('./../models/restaurantSchema');
const Users = require('./../models/userSchema');
const app = require('./../app');
const chai = require('chai');
const expect = chai.expect;

const permissionMessages = require('./../appMessages/permissions.json');
const authMessages = require('./../appMessages/authentication.json');
const helpFunc = require('./_helperFunctions');
const mongoose = require('mongoose');

const {
  getRestaurant,
  getJWT,
  addTestUser,
  getUserByEmail,
  getItinerary,
  addTestItinerary,
  postWithAuthentication,
  addTestRestaurant,
  getWithAuthentication,
  deleteWithAuthentication,
  patchWithAuthentication,
} = require('./_helperFunctions');
const { patch } = require('./../app');
const restaurantApi = '/api/v1/restaurant';
const testRestaurantPoint = {
  type: 'Point',
  coordinates: [-73.83504, 40.70752],
};
const testRestaurant = {
  name: "Spolini's",
  location: testRestaurantPoint,
  address: '116-25 Metropolitan Ave, Queens, NY 11418',
  website: 'https://spolinismenu.com',
};

var token = null;
describe('# Restaurants Api', function () {
  beforeEach(async function () {
    await Users.deleteMany({});
    await addTestUser();
    await addTestRestaurant('bob@gmail.com');
    const response = await getJWT();
    token = response.body.token;
  });
  describe('/ ROUTE', function () {
    it('POST should return 201 on succesfull restaurant creation', async function () {
      const response = await postWithAuthentication(
        `${restaurantApi}/`,
        token,
        testRestaurant
      );
      const { name, location, website, address } = response.body.data;
      expect(name).to.equal(testRestaurant.name);
      expect(response.status).to.equal(201);
      expect(website).to.equal(testRestaurant.website);
    });
  });
  describe('/:id ROUTE', function () {
    it('GET should return 200 on successfull restaurant query', async function () {
      const restaurant = await getRestaurant("Dani's house of pizza");
      const response = await getWithAuthentication(
        `${restaurantApi}/${restaurant._id}`,
        token
      );
      const { name, location, website } = response.body.data;
      expect(response.status).to.equal(200);
      expect(name).to.equal("Dani's house of pizza");
      expect(website).to.equal('https://danishouseofpizza.com');
    });
    it('DELETE should return 204 when deleting a restaurant entry', async function () {
      const restaurant = await getRestaurant("Dani's house of pizza");
      const response = await deleteWithAuthentication(
        `${restaurantApi}/${restaurant._id}`,
        token
      );
      expect(response.status).to.equal(204);
    });
    it('PATCH should return 200 and updated item when changing a restaurant entry', async function () {
      const restaurant = await getRestaurant("Dani's house of pizza");
      const updatedRestaurant = { name: 'the name was updated' };
      const response = await patchWithAuthentication(
        `${restaurantApi}/${restaurant._id}`,
        token,
        updatedRestaurant
      );
      const { name, website, address } = response.body.data;
      expect(response.status).to.equal(200);
      expect(name).to.equal(updatedRestaurant.name);
      expect(website).to.equal(restaurant.website);
      expect(address).to.equal(restaurant.address);
    });
    it('PATCH should not update advocate even when the property is in req.body', async function () {
      const id = mongoose.Types.ObjectId('zzzzzzzzzzzz');
      const restaurant = await getRestaurant("Dani's house of pizza");
      const originalUserId = restaurant.advocate;
      const updatedRestaurant = { name: 'the name was updated', advocate: id };
      const response = await patchWithAuthentication(
        `${restaurantApi}/${restaurant._id}`,
        token,
        updatedRestaurant
      );
      const { name, website, address, advocate } = response.body.data;
      assert.strictEqual(originalUserId.equals(advocate), true);
      expect(response.status).to.equal(200);
      expect(name).to.equal(updatedRestaurant.name);
      expect(website).to.equal(restaurant.website);
      expect(address).to.equal(restaurant.address);
    });
  });
});
