import React, { useState, useEffect } from 'react';
import GoogleMapReact from 'google-map-react';
import SearchBox from './SearchBox';
import axios from 'axios';
const { REACT_APP_MAPS_KEY } = process.env;

const AnyReactComponent = ({ text }) => <div>{text}</div>;
const defaultCenter = { lat: 40.7128, lng: -74.006 };

const zoom = 11;

function GoogleMaps() {
  const [map, setMap] = useState(null);
  const [googlemaps, setGooglemaps] = useState(null);
  const [apiReady, setApiReady] = useState(false);
  const [places, setPlaces] = useState([]);
  const [center, setCenter] = useState(defaultCenter);
  const checkAuthentication = async () => {
    try {
      const res = await axios.get('http://localhost:5000/test-jwt', {
        withCredentials: true,
      });
      console.log(res);
    } catch (error) {
      console.log(error);
    }
  };
  function handleApiLoaded(map, maps) {
    setApiReady(true);
    setMap(map);
    setGooglemaps(maps);
  }
  return (
    <div style={{ height: '100vh', width: '50%' }}>
      {apiReady && map && googlemaps && (
        <SearchBox
          map={map}
          setCenter={setCenter}
          maps={googlemaps}
          addPlace={setPlaces}
        />
      )}
      <GoogleMapReact
        bootstrapURLKeys={{ key: REACT_APP_MAPS_KEY, libraries: ['places'] }}
        defaultCenter={defaultCenter}
        center={center}
        defaultZoom={zoom}
        yesIWantToUseGoogleMapApiInternals
        onGoogleApiLoaded={({ map, maps }) => handleApiLoaded(map, maps)}
      >
        {places.map(({ lat, lng, name }) => {
          return (
            <AnyReactComponent key={name} lat={lat} lng={lng} text={name} />
          );
        })}
      </GoogleMapReact>
      <button onClick={checkAuthentication}> Check Authenticated</button>
    </div>
  );
}

export default GoogleMaps;
