// make sure to set NODE_ENV=test
const config = require('../config');
const request = require('supertest');
const chai = require('chai');
const expect = chai.expect;
const should = chai.should();
const mongoose = require('mongoose');
const Users = require('./../models/userSchema');
const app = require('./../app');
const appMessages = require('./../applicationMessages.json');
const authURL = '/api/v1/auth';
const signupURL = '/signup';
const loginURL = '/login';

async function addTestUser() {
  return await Users.create({
    firstName: 'bob',
    lastName: 'bob',
    email: 'bob@gmail.com',
    password: '123',
    passwordConfirm: '123',
  });
}

beforeEach((done) => {
  mongoose.connect(config.db.url, { useNewUrlParser: true }, () => done());
});
afterEach((done) => {
  mongoose.connection.db.dropDatabase(() => {
    mongoose.connection.close(() => done());
  });
});

describe('Auth API', function () {
  beforeEach(async function () {
    await Users.deleteMany({});
    return addTestUser();
  });

  it('/signup should return 201 on successful creation', function (done) {
    const user = {
      email: 'bob1@gmail.com',
      password: '1234',
      passwordConfirm: '1234',
      firstName: 'kris',
      lastName: 'bob',
    };
    request(app)
      .post(`${authURL}${signupURL}`)
      .send(user)
      //.expect({ status: 'success' })
      .expect(201, done);
  });

  it('/login should return 200 on successful login', function (done) {
    const info = {
      email: 'bob@gmail.com',
      password: '123',
    };
    request(app)
      .post(`${authURL}${loginURL}`)
      .send(info)
      //.expect({ status: 'success' })
      .expect(200, done);
  });

  it('/login should return 404 with no email', function (done) {
    const info = {
      password: '123',
    };
    const {
      message,
      statusCode,
    } = appMessages.authentication.login.noEmailOrPass;
    request(app)
      .post(`${authURL}${loginURL}`)
      .send(info)
      .expect(statusCode, { message: message, status: 'fail' }, done);
  });

  it('/login should return 404 with no pass', function (done) {
    const info = {
      email: 'bob@gmail.com',
    };
    const {
      message,
      statusCode,
    } = appMessages.authentication.login.noEmailOrPass;
    request(app)
      .post(`${authURL}${loginURL}`)
      .send(info)
      //.expect({ message: message })
      .expect(statusCode, { message: message, status: 'fail' }, done);
  });
});
