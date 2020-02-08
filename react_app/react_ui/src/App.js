import React from 'react';

import withRouter from 'react-router-dom/withRouter';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';

import TopBar from './component/ui/top/TopBar';
import {TabInfo} from './component/ui/top/TopBar';
import TabPatient from './component/ui/tab/TabPatient';

function App() {
  return (
    <div>
      <TopBar/>      
      <Switch>
        <Route path={TabInfo._patient.path}  component={TabPatient}></Route>
        <Route exact path={TabInfo._2D.path} component={TabPatient}></Route>
        <Route exact path={TabInfo._3D.path} component={TabPatient}></Route>
      </Switch>
    </div>
  );
}

export default withRouter(App);
