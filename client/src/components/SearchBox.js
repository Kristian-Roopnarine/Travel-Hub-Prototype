import React, { useCallback, useRef, useEffect } from 'react';
import ReactDOM from 'react-dom';

const SearchBox = ({ maps, addPlace, placeholder, map, setCenter }) => {
  const input = useRef(null);
  const searchBox = useRef(null);

  const handleOnPlacesChanged = useCallback(() => {
    if (addPlace) {
      const result = searchBox.current.getPlaces()[0];
      const lat = result.geometry.location.lat();
      const lng = result.geometry.location.lng();
      const { name, website, vicinity, url } = result;
      addPlace([{ name, website, vicinity, url, lat, lng }]);
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
    <input ref={input} placeholder="Enter your location here" type="text" />
  );
};

export default SearchBox;
