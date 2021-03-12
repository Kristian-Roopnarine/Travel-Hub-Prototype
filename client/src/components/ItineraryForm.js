import React, { useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
const { REACT_APP_SERVER_URL } = process.env;
function ItineraryForm() {
  const [city, setCity] = useState('');
  const [title, setTitle] = useState('');
  const [cityId, setCityId] = useState('');
  const [cityList, setCityList] = useState([]);
  let cityLookup = {};

  const createItinerary = async () => {
    if (!!city || !!title) {
      alert('Make sure all fields are filled out');
      return;
    }
    // need city ID
    const itinerary = { city: cityId, title };
    try {
      const url = `${REACT_APP_SERVER_URL}/itinerary`;
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(itinerary),
        mode: 'cors',
        credentials: 'include',
      });
      const { _id } = await response.json();
      return <Redirect to={`/itinerary/${_id}`} />;
    } catch (err) {
      console.log(err);
    }
  };
  // when city changes, query backend for cities that are similar, then create datalist with top 10
  useEffect(() => {
    if (city.length < 3) {
      return;
    }
    (async () => {
      try {
        const url = `${REACT_APP_SERVER_URL}/city/${city}`;
        const response = await fetch(url, {
          method: 'GET',
          credentials: 'include',
        });
        const { data } = await response.json();
        const newCityList = data.map(
          ({ _id, country, name, stateName }, ind) => {
            cityLookup[_id] = name;
            const displayString = stateName
              ? `${stateName} - ${country.name}`
              : `${country.name}`;
            return (
              <option value={name} data_value={_id} key={_id}>
                {displayString}
              </option>
            );
          }
        );
        setCityList(newCityList);
      } catch (err) {
        console.log(err);
      }
    })();
  }, [city]);

  useEffect(() => {
    console.log({ city });
    console.log({ cityId });
  }, [city, cityId]);

  const setDetails = (e) => {
    setCity(e.target.value);
    console.log(e.target);
  };
  return (
    <>
      <div className="w-80 my-10 mx-auto border rounded shadow-lg">
        <div className="flex flex-col space-y-4 items-center py-6 px-3">
          <h3 className="font-sans text-2xl">Plan your trip</h3>
          <div className="flex items-center justify-between">
            <label for="title" className="mr-2">
              Trip title:{' '}
            </label>
            <input
              className="rounded-md bg-gray-100 focus:border-gray-500 h-8 focus:bg-white focus:ring-0"
              onChange={(e) => setTitle(e.target.value)}
              id="title"
              name="title"
              type="text"
            />
          </div>
          <div className="flex items-center justify-between">
            <label className="mr-2" for="city-choice">
              Enter a city:{' '}
            </label>
            <input
              className="rounded-md bg-gray-100 focus:border-gray-500 h-8 focus:bg-white focus:ring-0"
              type="text"
              list="filtered-cities"
              onChange={setDetails}
              onSelect={(e) => setCityId(e.target.key)}
              id="city-choice"
              name="city-choice"
              value={city}
            />
          </div>
          <datalist id="filtered-cities">{cityList}</datalist>
          <button
            className="bg-pink-300 rounded w-full p-2 text-white"
            type="submit"
          >
            Create
          </button>
        </div>
      </div>
    </>
  );
}

export default ItineraryForm;
