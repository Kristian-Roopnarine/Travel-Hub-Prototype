import React from 'react';
import PropTypes from 'prop-types';

function UserIcon({ name }) {
  const initial = name[0].toUpperCase();

  return (
    <div className="bg-gray-300 h-6 w-6 flex items-center justify-center rounded-full">
      <p className="text-sm text-white"> {initial} </p>
    </div>
  );
}
UserIcon.propTypes = {
  name: PropTypes.string,
};
export default UserIcon;
