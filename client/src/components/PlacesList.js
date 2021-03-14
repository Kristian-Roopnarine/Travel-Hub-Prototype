import React from 'react';

function PlacesList({ type, children }) {
  return (
    <div className="w-5/6">
      <h1 className="font-sans font-bold text-2xl border-b-2 border-gray-300">
        {type}
      </h1>
      <div className="flex-1 flex overflow-y-scroll scrollbar-thin scrollbar scrollbar-thumb-gray-500">
        <div className="flex-1 p-4 h-56">{children}</div>
      </div>
    </div>
  );
}

export default PlacesList;
