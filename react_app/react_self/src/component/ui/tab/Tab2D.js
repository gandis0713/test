import React from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Typography from '@material-ui/core/Typography';

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
        content: {
          flexGrow: 1
        },
        toolbar: theme.mixins.toolbar,
      }
    )
  )
);

function Tab2D () {

  const classes = useStyles();

  return (
      <div className={classes.root}>
        <Drawer
          className={classes.drawer}
          anchor="left"
          variant="permanent"
          classes={{ paper: classes.drawerPaper }} >          
          <div className={classes.toolbar}/>
          <p>2D Panel</p>
        </Drawer>
        <div>
          <div className={classes.toolbar}/>
          <p>2D View</p>
        </div>
      </div>
  );
}

export default Tab2D;