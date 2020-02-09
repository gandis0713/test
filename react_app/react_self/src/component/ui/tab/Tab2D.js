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
        toolbar: theme.mixins.toolbar,
        drawer: {
          [theme.breakpoints.up('sm')]: {
            width: 240,
            flexShrink: 0,
          },
        },
        drawerPaper: {
          width: 240,
        }
      }
    )
  )
);

function Tab2D () {

  const classes = useStyles();

  return (
      <div className={classes.root}>
        <Drawer
          anchor="left"
          variant="permanent"
          classes={{ paper: classes.drawerPaper }} >          
          <div className={classes.toolbar}/>
          <p>2D Panel</p>
        </Drawer>
      </div>
  );
}

export default Tab2D;