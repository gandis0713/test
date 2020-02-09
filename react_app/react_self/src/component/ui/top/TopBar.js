import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

import { Link } from 'react-router-dom';

const useStyles = makeStyles(theme => ({
  appBar: {
    flexGrow: 1,
    zIndex: theme.zIndex.drawer + 1,
  },
  tabs: {
    flexGrow: 1,
  }
}));

export const Top = {
  tabPatient: {
    name: 'Patient',
    path: '/patient'
  },
  tab2D: {
    name: '2D',
    path: '/2D'
  },
  tab3D: {
    name: '3D',
    path: '/3D'
  },
};

function TopBar () {

  const classes = useStyles();

  const [tabIndex, setTabIndex] = useState(2);
  const changeTab = function(event, index) {
    setTabIndex(Number(index));
  }

  return (
    <div>
      <AppBar className={classes.appBar}>
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
              label={Top.tabPatient.name}
              component={Link}
              to={Top.tabPatient.path}/>
            <Tab
              label={Top.tab2D.name}
              component={Link}
              to={Top.tab2D.path}/>
            <Tab
              label={Top.tab3D.name}
              component={Link}
              to={Top.tab3D.path}/>
          </Tabs>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
    </div>
  );
}

export default TopBar;