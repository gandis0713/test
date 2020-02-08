import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import Link from 'react-router-dom/Link';

const useStyles = makeStyles(theme => ({
  appbar: {
    flexGrow: 1,
  },
  tabs: {
    flexGrow: 1,
  }
}));

export const TabInfo = {
  _patient: {
    name: 'Patient',
    path: '/patient'
  },
  _2D: {
    name: '2D',
    path: '/2D'
  },
  _3D: {
    name: '3D',
    path: '/3D'
  },
};

function TopBar () {

  const classes = useStyles();

  const [tabIndex, setTabIndex] = useState(-1);
  const changeTab = function(event, index) {
    setTabIndex(Number(index));
  }

  return (
    <div>
      <AppBar className={classes.appbar}>
        <Toolbar>
          <IconButton
            edge="start"
            color="inherit">
            <MenuIcon />
          </IconButton>                
          <Tabs
            className={classes.tabs}
            value={tabIndex}
            onChange={changeTab}>
            <Tab 
              label={TabInfo._patient.name}
              component={Link}
              to={TabInfo._patient.path}/>
            <Tab
              label={TabInfo._2D.name}
              component={Link}
              to={TabInfo._2D.path}/>
            <Tab
              label={TabInfo._3D.name}
              component={Link}
              to={TabInfo._3D.path}/>
          </Tabs>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default TopBar;