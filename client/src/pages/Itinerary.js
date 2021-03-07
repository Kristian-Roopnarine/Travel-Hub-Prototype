import React, { useState, useEffect } from 'react';
import GoogleMaps from './../components/GoogleMaps';
import Members from './../components/Members';
import { useParams } from 'react-router-dom';

const { REACT_APP_SERVER_URL } = process.env;

function Itinerary() {
  let { id } = useParams();
  const [itinerary, setItinerary] = useState({});
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
  }, []);
  useEffect(() => {
    console.log(itinerary);
  }, [itinerary]);
  return (
    <>
      <div className="flex">
        <div className="w-1/2 ">
          {itinerary.title}
          <div className="flex justify-between">
            <Members members={[]} />
          </div>
        </div>
        <div className="w-1/2 ">
          <GoogleMaps />
        </div>
      </div>
    </>
  );
}

export default Itinerary;
