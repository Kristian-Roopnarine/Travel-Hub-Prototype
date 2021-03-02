import React from 'react';
import GoogleMaps from './../components/GoogleMaps';
import { useParams } from 'react-router-dom';

function Itinerary() {
  let { id } = useParams();
  return (
    <>
      <h2 className="font-mono">The ID of this itinerary is {id}</h2>
      <p className="font-mono">Your itinerary </p>
      <GoogleMaps />
    </>
  );
}

export default Itinerary;
