import React from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

const useStyles = makeStyles (
  theme => (
    createStyles (
      {
        root: {
          display: "flex"
        },
        drawer: {
          width: 240,
          flexShrink: 0,
        },
        drawerPaper: {
          width: 240,
        },
        toolbar: theme.mixins.toolbar
      }
    )
  )
);

function TabPatient () {

  const classes = useStyles();

  return (
      <div className={classes.root}>
        <Drawer
          className={classes.drawer}
          anchor="left"
          variant="permanent"
          classes={{ paper: classes.drawerPaper }} >          
          <div className={classes.toolbar}/>
          <p>Patient Panel</p>
        </Drawer>
        <div>
          <div className={classes.toolbar}/>
          <p>Patient View</p>
        </div>
      </div>
  );
}

export default TabPatient;