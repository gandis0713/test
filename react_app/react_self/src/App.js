import React from 'react';

import { withRouter, Switch, Route } from 'react-router-dom';

import TopBar from './component/ui/top/TopBar';
import {Top} from './component/ui/top/TopBar';
import Tab3D from './component/ui/tab/Tab3D';
import Tab2D from './component/ui/tab/Tab2D';
import TabPatient from './component/ui/tab/TabPatient';
import TabVTK from './component/ui/tab/TabVTK';

function App() {
  return (
    <div>
      <TopBar/>      
      <Switch>
        <Route path={Top.tabPatient.path}  component={TabPatient}></Route>
        <Route exact path={Top.tab2D.path} component={Tab2D}></Route>
        <Route exact path={Top.tab3D.path} component={Tab3D}></Route>
        <Route exact path={Top.tabVTK.path} component={TabVTK}></Route>
      </Switch>
    </div>
  );
}

export default withRouter(App);
