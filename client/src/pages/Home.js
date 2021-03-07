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
      <div className="flex mx-auto justify-evenly">
        <div className="w-1/3">
          <ListDisplay
            headerText={'Upcoming Trips'}
            backgroundColor="bg-yellow-100"
          >
            <Itineraries />
          </ListDisplay>
        </div>
        <div className="w-1/3">
          <ListDisplay
            headerText={'Your Travel Guides'}
            backgroundColor="bg-yellow-100"
          ></ListDisplay>
        </div>
      </div>
    </>
  );
}

export default Home;
