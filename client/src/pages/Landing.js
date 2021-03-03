import React from 'react';
import { Redirect } from 'react-router-dom';

function Landing({ loggedIn }) {
  if (loggedIn) {
    return <Redirect to="/home" />;
  }
  return <h2>Landing page</h2>;
}

export default Landing;
