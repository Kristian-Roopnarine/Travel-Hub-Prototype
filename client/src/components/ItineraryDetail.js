import React from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';

import { ReactComponent as CarryOn } from './../static/img/carry-on-colour.svg';
import Members from './Members';

function ItineraryDetail({ title, city, id, members }) {
  return (
    <>
      <div className="flex justify-center justify-around items-center">
        <div className="w-20">
          <CarryOn />
        </div>
        <div className="flex w-4/6 flex-col space-y-2 max-w-xs py-6">
          <div>
            <Link to={`/itinerary/${id}`}>
              <p className="font-mono text-xl">{title}</p>
            </Link>
          </div>
          <div className="flex justify-between">
            <Members members={members} />
            <p className="font-mono text-xs">Date support soon..</p>
          </div>
        </div>
      </div>
    </>
  );
}

export default ItineraryDetail;
