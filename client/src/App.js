import Home from './pages/Home';
import Itinerary from './pages/Itinerary';
import Profile from './pages/Profile';
import TravelGuides from './pages/TravelGuides';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/" exact component={Home} />
        <Route path="/itinerary" component={Itinerary} />
        <Route path="/profile" component={Profile} />
        <Route path="/travel-guides" component={TravelGuides} />
      </Switch>
    </Router>
  );
}

export default App;
