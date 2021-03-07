import React from 'react';
import { AiFillDelete } from 'react-icons/ai';
import { FiThumbsDown, FiThumbsUp } from 'react-icons/fi';
const { REACT_APP_SERVER_URL } = process.env;
function PlaceCard({ place }) {
  const { name, website, address, photoUrl, _id } = place;
  const deletePlace = async () => {
    let url = `${REACT_APP_SERVER_URL}/place/${_id}`;
    try {
      const response = await fetch(url, {
        method: 'DELETE',
        credentials: 'include',
      });
      const { data } = await response.json();
      console.log(data);
    } catch (err) {
      console.log(err);
    }
  };
  return (
    <div className="flex w-full space-x-1 border rounded">
      <div className="w-1/3 mx-auto relative">
        <img className="object-cover w-full h-full absolute" src={photoUrl} />
      </div>

      <div className="w-2/3 p-2">
        <div className="flex flex-col">
          <div className="flex justify-between">
            <h4 className="font-sans text-sm font-bold">{name}</h4>
            <AiFillDelete
              color={'red'}
              onClick={deletePlace}
              style={{ cursor: 'pointer' }}
            />
          </div>

          <div className="flex flex-col py-1">
            <h4 className="font-sans text-xs text-gray-500">{address}</h4>
            <h4 className="font-sans text-xs text-gray-500">{website}</h4>
          </div>

          <div className="flex justify-between">
            <button type="button" className="bg-gray-300 h-full px-1 rounded">
              <span className="text-xs font-sans text-black">
                Add to specific day
              </span>
            </button>

            <div className="flex space-x-1">
              <FiThumbsUp />
              <FiThumbsDown />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PlaceCard;
