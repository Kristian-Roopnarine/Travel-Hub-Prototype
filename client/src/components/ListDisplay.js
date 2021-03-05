import React from 'react';
import PropTypes from 'prop-types';

import Itineraries from './Itineraries';

function ListDisplay({ headerText, button, children }) {
  return (
    <>
      <div className="flex flex-col justify-center bg-yellow-100 rounded-t-lg">
        <div className="text-left font-semibold py-4 text-2xl px-2 border-b-2 border-yellow-200">
          {headerText}
        </div>
        <div>{children}</div>
      </div>
    </>
  );
}
ListDisplay.propTypes = {
  headerText: PropTypes.string,
  button: PropTypes.node,
  children: PropTypes.node,
};

export default ListDisplay;
