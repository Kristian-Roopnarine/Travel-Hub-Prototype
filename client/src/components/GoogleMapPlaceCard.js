import React from 'react';
import { FaMapMarkerAlt } from 'react-icons/fa';
import { BiWorld } from 'react-icons/bi';
import { AiFillPhone } from 'react-icons/ai';
import { MdAttachMoney } from 'react-icons/md';

function GoogleMapPlaceCard({ place }) {
  const {
    name,
    website,
    address,
    photos,
    price_level,
    formatted_phone_number,
    weekday_text,
  } = place;
  const priceIcons = [];
  for (let i = 0; i < price_level; i++) {
    priceIcons.push(<MdAttachMoney color={'grey'} />);
  }

  const photoUrl = photos[0].getUrl();
  return (
    <div className="max-h-52 justify-between flex bg-white rounded w-full">
      <div className="flex flex-col space-y-4 py-4 px-2 font-sans">
        <h3 className="flex items-center font-bold space-x-2">
          {name} {priceIcons}
        </h3>
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

      <img src={photoUrl} className="h-auto w-1/3 rounded" />
    </div>
  );
}

export default GoogleMapPlaceCard;
