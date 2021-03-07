import React, { useCallback, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

const SearchBox = ({
  maps,
  setCurrentPlace,
  addPlace,
  placeholder,
  map,
  setCenter,
}) => {
  const input = useRef(null);
  const searchBox = useRef(null);

  const handleOnPlacesChanged = useCallback(() => {
    if (addPlace) {
      const result = searchBox.current.getPlaces()[0];
      const lat = result.geometry.location.lat();
      const lng = result.geometry.location.lng();
      const {
        weekday_text,
        price_level,
        formatted_phone_number,
        name,
        website,
        photos,
        vicinity: address,
        url,
        types,
      } = result;
      const category = types.includes('tourist_attraction')
        ? 'tourist_attraction'
        : 'restaurant';
      addPlace([{ name, website, address, url, lat, lng }]);
      setCurrentPlace({
        name,
        weekday_text,
        price_level,
        formatted_phone_number,
        website,
        address,
        photos,
        lat,
        lng,
        category,
      });
      setCenter({ lat, lng });
    }
  }, [addPlace, searchBox]);
  useEffect(() => {
    if (!searchBox.current && maps) {
      searchBox.current = new maps.places.SearchBox(input.current);
      searchBox.current.addListener('places_changed', handleOnPlacesChanged);
    }
    return () => {
      if (maps) {
        searchBox.current = null;
        maps.event.clearInstanceListeners(searchBox);
      }
    };
  }, [maps, handleOnPlacesChanged]);
  return (
    <input
      className="border rounded p-1 m-1 w-96"
      ref={input}
      placeholder="Enter your location here"
      type="text"
    />
  );
};

export default SearchBox;
