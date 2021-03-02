const mongoose = require('mongoose');
const fs = require('fs');
const csvtojson = require('csvtojson');
const Cities = require('./models/citySchema');
const Countries = require('./models/countrySchema');
const config = require('./config');
let totalCities = 0;
let totalCountries = 0;
const FILE_NAME = './worldcities.csv';
const asyncCatchWrapper = require('./utils/asyncCatchWrapper');

async function addCity({ city, lat, lng, iso2, iso3 }, country) {
  const cit = await Cities.findOne({ name: city }).exec();
  if (cit) {
    console.log('City already in db');
    return;
  }
  const cityPoint = {
    type: 'Point',
    coordinates: [lng, lat],
  };
  let cityData = {
    name: city,
    coordinates: cityPoint,
    country: country._id,
    iso2,
    iso3,
  };
  await Cities.create(cityData);
  cityCount += 1;
}

let seedCountries = asyncCatchWrapper(async function createCsv() {
  let results = await csvtojson().fromFile(FILE_NAME);
  let countries = new Set();
  results.forEach((data) => {
    countries.add(data.country);
  });
  let uniqueCountries = Array.from(countries);
  let countryDocs = uniqueCountries.map((country) => {
    return {
      name: country,
    };
  });
  await mongoose.connect(config.db.url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  console.log('Connected to db');
  await Countries.insertMany(countryDocs);
});

let seedCities = asyncCatchWrapper(async function createCsv2() {
  let results = await csvtojson().fromFile(FILE_NAME);
  await mongoose.connect(config.db.url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
  });
  const countries = await Countries.find();
  //convert to country lookup {country_name:_id}
  const countryLookup = {};
  countries.forEach((country) => (countryLookup[country.name] = country._id));
  // create city documents
  const cityDocs = results.map(({ city, lng, lat, country, iso2, iso3 }) => {
    const cityPoint = {
      type: 'Point',
      coordinates: [lng, lat],
    };
    let cityData = {
      name: city,
      coordinates: cityPoint,
      country: countryLookup[country],
      iso2,
      iso3,
    };
    return cityData;
  });
  await Cities.insertMany(cityDocs);
});

//seedCountries();
seedCities();
