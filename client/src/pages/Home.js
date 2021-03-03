import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
const { REACT_APP_SERVER_URL } = process.env;

function Home({ loggedIn, setLoggedIn }) {
  useEffect(() => {
    (async () => {
      const response = await fetch(`${REACT_APP_SERVER_URL}/auth/loggedIn`, {
        method: 'GET',
        credentials: 'include',
      });
      const userStatus = response.status === 200;
      setLoggedIn(userStatus);
    })();
  }, []);

  if (!loggedIn) {
    return <Redirect to="/" />;
  }
  return (
    <>
      <h2>Home page</h2>
    </>
  );
}

export default Home;
