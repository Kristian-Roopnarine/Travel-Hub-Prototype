import React, { useState, useEffect } from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import GoogleMapReact from 'google-map-react';
import SearchBox from './SearchBox';
import GoogleMapPlaceCard from './GoogleMapPlaceCard';
import { useParams } from 'react-router-dom';
const { REACT_APP_MAPS_KEY } = process.env;

const defaultCenter = { lat: 40.7128, lng: -74.006 };

const zoom = 11;

function GoogleMaps() {
  const { id } = useParams();
  const [map, setMap] = useState(null);
  const [googlemaps, setGooglemaps] = useState(null);
  const [apiReady, setApiReady] = useState(false);
  const [places, setPlaces] = useState([]);
  const [center, setCenter] = useState(defaultCenter);
  const [currentPlace, setCurrentPlace] = useState({});
  function handleApiLoaded(map, maps) {
    setApiReady(true);
    setMap(map);
    setGooglemaps(maps);
  }
  return (
    <div className="relative ">
      <div className="absolute top-0 left-0 z-10">
        {apiReady && map && googlemaps && (
          <SearchBox
            map={map}
            setCenter={setCenter}
            maps={googlemaps}
            addPlace={setPlaces}
            setCurrentPlace={setCurrentPlace}
          />
        )}
      </div>
      <div style={{ height: '39.5rem', width: '100%' }}>
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
              <FaMapMarkerAlt
                size={'1.5rem'}
                key={name}
                lat={lat}
                lng={lng}
                text={name}
              />
            );
          })}
        </GoogleMapReact>
      </div>

      <div className="absolute px-2 bottom-0">
        {currentPlace.hasOwnProperty('name') ? (
          <GoogleMapPlaceCard place={currentPlace} itineraryId={id} />
        ) : null}
      </div>
    </div>
  );
}

export default GoogleMaps;
