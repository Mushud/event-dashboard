import logo from "./logo.svg";
import "./App.css";

import {BrowserRouter as Router, Switch, Route, Link} from 'react-router-dom'
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <Login />
        </Route>
        <Route exact path="/dashboard">
          <Dashboard />
        </Route>
      </Switch>
    </Router>
  
  );
}

export default App;
