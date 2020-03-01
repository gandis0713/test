import React from 'react'
import { Route, Switch } from 'react-router-dom';
import { Home, Patient, MPR } from 'pages';

function App() {
  return (
    <div>
      <Route exact path="/" component={Home}/>
      <Switch>
        <Route path="/patient/:name" component={Patient}/>
        <Route path="/patient" component={Patient}/>
      </Switch>
      <Route path="/mpr" component={MPR}/>
    </div>
  );
}

export default App;