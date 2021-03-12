import React, { useEffect } from 'react';
import { Redirect, Link } from 'react-router-dom';
import ListDisplay from './../components/ListDisplay';
import Itineraries from './../components/Itineraries';
const { REACT_APP_SERVER_URL } = process.env;

function CreateItineraryButton() {
  return (
    <div className="p-2 mr-1 text-xs bg-red-400 h-full rounded">
      <Link to="/itinerary/create">Create</Link>
    </div>
  );
}

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
            createLink={<CreateItineraryButton />}
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
