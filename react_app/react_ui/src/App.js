import React from 'react';

import withRouter from 'react-router-dom/withRouter';
import Switch from 'react-router-dom/Switch';
import Route from 'react-router-dom/Route';

import TopBar from './component/ui/top/TopBar';
import {Top} from './component/ui/top/TopBar';
import Tab3D from './component/ui/tab/Tab3D';

function App() {
  return (
    <div>
      <TopBar/>      
      <Switch>
        <Route path={Top.tabPatient.path}  component={Tab3D}></Route>
        <Route exact path={Top.tab2D.path} component={Tab3D}></Route>
        <Route exact path={Top.tab3D.path} component={Tab3D}></Route>
      </Switch>
    </div>
  );
}

export default withRouter(App);
