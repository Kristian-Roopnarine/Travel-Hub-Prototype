import GoogleMaps from './components/GoogleMaps';
import Login from './components/Login';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
function App() {
  return (
    <Router>
      <Switch>
        <Route path="/map">
          <GoogleMaps />;
        </Route>
        <Route path="/google-login">
          <Login />
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
