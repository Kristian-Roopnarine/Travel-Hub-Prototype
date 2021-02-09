require('dotenv').config();
const env = process.env.NODE_ENV;

const dev = {
  app: {
    port: parseInt(process.env.DEV_APP_PORT) || 5000,
    url: process.env.FRONT_END_DEV,
  },
  db: {
    /*
    host: process.env.DEV_DB_HOST || 'localhost',
    port: parseInt(process.env.DEV_DB_PORT) || 27017,
    name: process.env.DEV_DB_NAME || 'db',
    */
    url: process.env.DEV_DB_STRING.replace('<password>', process.env.DB_PASS),
  },
};

const test = {
  app: {
    port: parseInt(process.env.TEST_APP_PORT) || 5000,
  },
  db: {
    /*
    host: process.env.TEST_DB_HOST || 'localhost',
    port: parseInt(process.env.TEST_DB_PORT) || 27017,
    name: process.env.TEST_DB_NAME || 'test',
    */
    url: process.env.TEST_DB_STRING,
  },
};

const config = {
  dev,
  test,
};

console.log(`Currently using the ${env} app settings.`);
module.exports = config[env];
