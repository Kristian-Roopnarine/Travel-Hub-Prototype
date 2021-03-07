import React, { useState, useEffect } from 'react';
import GoogleMaps from './../components/GoogleMaps';
import Members from './../components/Members';
import PlaceCard from './../components/PlaceCard';
import { useParams } from 'react-router-dom';
import PlacesList from '../components/PlacesList';

const { REACT_APP_SERVER_URL } = process.env;

function Itinerary() {
  let { id } = useParams();
  const [itinerary, setItinerary] = useState({});
  const [places, setPlaces] = useState([
    {
      name: 'Testing',
      website: 'testing.com',
      address: 'This is not a real address',
      photoUrl:
        'https://images.squarespace-cdn.com/content/v1/59d69ff6914e6bf5006ee19f/1507239450478-WEVY1I0T56VLHRGUL0U2/ke17ZwdGBToddI8pDm48kLkXF2pIyv_F2eUT9F60jBl7gQa3H78H3Y0txjaiv_0fDoOvxcdMmMKkDsyUqMSsMWxHk725yiiHCCLfrh8O1z4YTzHvnKhyp6Da-NYroOW3ZGjoBKy3azqku80C789l0iyqMbMesKd95J-X4EagrgU9L3Sa3U8cogeb0tjXbfawd0urKshkc5MgdBeJmALQKw/IMG_8463.JPG?format=2500w',
    },
  ]);
  const attractionList = places.filter(
    (place) => place.category === 'tourist_attraction'
  );
  const restaurantList = places.filter(
    (place) => place.category === 'restaurant'
  );
  const renderRestaurants = restaurantList.map((place) => {
    return (
      <div className="mt-2">
        <PlaceCard place={place} />
      </div>
    );
  });
  const renderAttractions = attractionList.map((place) => {
    return (
      <div className="mt-2">
        <PlaceCard place={place} />
      </div>
    );
  });
  useEffect(() => {
    (async () => {
      console.log('Making request');
      const response = await fetch(`${REACT_APP_SERVER_URL}/itinerary/${id}`, {
        method: 'GET',
        credentials: 'include',
      });
      const { data } = await response.json();
      setItinerary(data);
    })();
    (async () => {
      console.log('Making request for places');
      const response = await fetch(
        `${REACT_APP_SERVER_URL}/itinerary/${id}/place`,
        {
          method: 'GET',
          credentials: 'include',
        }
      );
      const { data } = await response.json();
      setPlaces(data);
    })();
  }, []);
  useEffect(() => {
    console.log({ itinerary });
    console.log({ places });
  }, [itinerary, places]);
  return (
    <>
      <div className="flex" style={{ height: '90vh' }}>
        <div className="w-1/2 flex-1 flex-col overflow-y-scroll scrollbar scrollbar-thumb-gray-500 scrollbar-thin">
          {!itinerary.hasOwnProperty('members') ? (
            <>
              <h2>Loading itinerary details..</h2>
              <svg
                className="animate-spin h-5 w-5 text-center"
                viewBox="0 0 24 24"
              ></svg>
            </>
          ) : (
            <>
              <div className="flex pt-4 justify-center items-end">
                <h2 className="font-sans text-center text-5xl">
                  {itinerary.title}
                </h2>
                <span className="ml-2">
                  <Members
                    members={[...itinerary.members, itinerary.creator]}
                  />
                </span>
              </div>
              <div className="flex justify-center">
                <PlacesList type={'Restaurants'}>
                  {renderRestaurants}
                </PlacesList>
              </div>
              <div className="flex justify-center mt-3">
                <PlacesList type={'Attractions'}>
                  {renderAttractions}
                </PlacesList>
              </div>
            </>
          )}
        </div>
        <div className="w-1/2 shadow-inner flex-1">
          <GoogleMaps />
        </div>
      </div>
    </>
  );
}

export default Itinerary;
