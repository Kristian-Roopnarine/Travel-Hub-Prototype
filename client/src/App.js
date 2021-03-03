import React, { useState, useEffect } from 'react';
import Home from './pages/Home';
import Landing from './pages/Landing';
import Itinerary from './pages/Itinerary';
import Profile from './pages/Profile';
import TravelGuides from './pages/TravelGuides';
import Navbar from './components/Navbar';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';

function App() {
  const [isLoggedIn, setLoggedIn] = useState(false);

  return (
    <Router>
      <Navbar loggedIn={isLoggedIn} />
      <Switch>
        <Route path="/" exact>
          <Landing loggedIn={isLoggedIn} />
        </Route>
        <Route path="/home">
          <Home loggedIn={isLoggedIn} setLoggedIn={setLoggedIn} />
        </Route>
        <Route path="/itinerary/:id" component={Itinerary} />
        <Route path="/profile" component={Profile} />
        <Route path="/travel-guides" component={TravelGuides} />
      </Switch>
    </Router>
  );
}

export default App;
