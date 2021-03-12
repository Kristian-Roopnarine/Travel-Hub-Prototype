import React from 'react';
import PropTypes from 'prop-types';

function ListDisplay({ headerText, createLink, backgroundColor, children }) {
  return (
    <>
      <div
        className={`flex flex-col justify-center ${backgroundColor} rounded-t-lg`}
      >
        <div className="flex justify-between items-center border-b-2 border-yellow-300">
          <div className="text-left font-semibold py-4 text-2xl px-2">
            {headerText}
          </div>
          {createLink}
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
