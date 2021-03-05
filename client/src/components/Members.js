import React from 'react';
import PropTypes from 'prop-types';
import UserIcon from './UserIcon';

function Members({ members }) {
  const memberList = members.map(({ _, firstName }) => {
    return <UserIcon name={firstName} />;
  });
  return (
    <>
      <div className="flex">{memberList}</div>
    </>
  );
}

Members.propTypes = {
  members: PropTypes.array,
};
export default Members;
