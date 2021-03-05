import React from 'react';
import { Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';

function Landing({ loggedIn }) {
  if (loggedIn) {
    return <Redirect to="/home" />;
  }
  return (
    <>
      <h2>Landing page</h2>
    </>
  );
}
Landing.propTypes = {
  loggedIn: PropTypes.bool,
};
export default Landing;
