import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { BiWorld } from 'react-icons/bi';
import { AiFillPhone } from 'react-icons/ai';
import { MdAttachMoney } from 'react-icons/md';
const { REACT_APP_SERVER_URL } = process.env;

function GoogleMapPlaceCard({ place, itineraryId }) {
  const {
    name,
    website,
    address,
    photos,
    price_level,
    formatted_phone_number,
    category,
    lat,
    lng,
    weekday_text,
  } = place;
  const priceIcons = [];
  for (let i = 0; i < price_level; i++) {
    priceIcons.push(<MdAttachMoney color={'grey'} />);
  }

  const photoUrl = photos[0].getUrl();

  const addToItinerary = async () => {
    let url = `${REACT_APP_SERVER_URL}/itinerary/${itineraryId}/place`;
    let data = {
      name,
      website,
      address,
      photoUrl,
      location: { type: 'Point', coordinates: [lng, lat] },
      category,
    };
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(data),
        mode: 'cors',
        credentials: 'include',
      });
      const { data: placeData } = await response.json();
      console.log({ placeData });
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <div className="max-h-52 justify-between flex bg-white rounded w-full">
      <div className="flex flex-col space-y-4 py-4 px-2 font-sans">
        <h3 className="flex items-center font-bold">
          {name} {priceIcons}
        </h3>
        <div>
          <button
            type="button"
            onClick={addToItinerary}
            className="bg-indigo-300 h-full px-1 rounded"
          >
            <span className="text-xs font-sans text-white">Add to trip</span>
          </button>
        </div>
        <div className="flex space-x-2">
          <FaMapMarkerAlt color={'grey'} />
          <p className="text-xs">{address}</p>
        </div>

        <div className="flex space-x-2">
          <BiWorld color={'grey'} />

          <a className="text-xs" href={website}>
            {website ? website : 'No website returned'}
          </a>
        </div>
        <div className="flex space-x-2">
          <AiFillPhone color={'grey'} />
          <p className="text-xs">{formatted_phone_number} </p>
        </div>
      </div>
      <div className="w-1/3">
        <img className="object-cover w-full h-full" src={photoUrl} />
      </div>
    </div>
  );
}

export default GoogleMapPlaceCard;
