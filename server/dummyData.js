const Cities = require('./models/citySchema');
const Itineraries = require('./models/itinerarySchema');
const Lodges = require('./models/lodgeSchema');
const Places = require('./models/placesSchema');
const Users = require('./models/userSchema');
const asyncCatchWrapper = require('./utils/asyncCatchWrapper');

exports.createDummyData = asyncCatchWrapper(async () => {
  const user = await Users.findOne({
    email: 'kristian.roopnarine@gmail.com',
  }).exec();
  const city = await Cities.findOne({ name: 'New York' }).exec();
  let itinerary = await Itineraries.findOne({ title: 'New York Trip' }).exec();
  if (!itinerary) {
    itinerary = await Itineraries.create({
      title: 'New York Trip',
      creator: user._id,
      city: city._id,
    });
  }
  let restaurant = await Places.findOne({ name: 'New York Restaurant' }).exec();
  if (!restaurant) {
    const testRestaurant = {
      type: 'Point',
      coordinates: [-73.83063, 40.70918],
    };
    await Places.create({
      name: 'New York Restaurant',
      itinerary: itinerary._id,
      advocate: user._id,
      location: testRestaurant,
      website: 'https://danishouseofpizza.com',
      address: '81-28 Lefferts Blvd, Kew Gardens, NY 11415',
      category: 'restaurant',
    });
  }
  let attraction = await Places.findOne({ name: 'New York Attraction' }).exec();
  if (!attraction) {
    const testAttraction = {
      type: 'Point',
      coordinates: [-74.0445, 40.6892],
    };
    await Places.create({
      name: 'New York Attraction',
      itinerary: itinerary._id,
      advocate: user._id,
      location: testAttraction,
      website: 'https://nps.gov/stli/index.htm',
      address: 'New York, NY 10004',
      category: 'tourist_attraction',
    });
  }
  let lodge = await Lodges.findOne({ name: 'New York Lodge' }).exec();
  if (!lodge) {
    await Lodges.create({
      name: 'New York Lodge',
      itinerary: itinerary._id,
      advocate: user._id,
      website:
        'https://www.airbnb.com/rooms/41986091?federated_search_id=84171d8e-3917-46fe-91d0-99e666a506bc&source_impression_id=p3_1614724031_pRV3B%2FM83fbzy2PM&guests=1&adults=1',
    });
  }
  console.log('Filled with dummy data');
});
