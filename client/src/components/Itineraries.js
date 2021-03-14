import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import ItineraryDetail from './ItineraryDetail';
const { REACT_APP_SERVER_URL } = process.env;

function Itineraries() {
  const [itineraryList, setItineraryList] = useState([]);
  useEffect(() => {
    (async () => {
      const response = await fetch(`${REACT_APP_SERVER_URL}/itinerary/`, {
        method: 'GET',
        credentials: 'include',
      });
      const { data } = await response.json();
      setItineraryList(data);
    })();
  }, []);
  useEffect(() => {
    console.log(itineraryList);
  }, [itineraryList]);

  const renderItineraries = itineraryList.map(
    ({ title, city, members, _id, creator }) => {
      return (
        <ItineraryDetail
          title={title}
          members={[...members, creator]}
          id={_id}
          city={city}
        />
      );
    }
  );
  return (
    <>
      <div>{renderItineraries}</div>
    </>
  );
}

export default Itineraries;
