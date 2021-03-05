import React, { useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import ListDisplay from './../components/ListDisplay';
import Itineraries from './../components/Itineraries';
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
      <div className="flex mx-auto justify-around">
        <div className="w-1/3">
          <ListDisplay headerText={'Upcoming Trips'}>
            <Itineraries />
          </ListDisplay>
        </div>
        <div className="w-1/3">Your travel guides here</div>
      </div>
    </>
  );
}

export default Home;
