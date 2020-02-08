import React from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
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
        },
      }
    )
  )
);

function Init() {
  const canvas = document.getElementById("can_1");
  // Initialize the GL context
  const gl = canvas.getContext("webgl");

  // Only continue if WebGL is available and working
  if (gl === null) {
      alert("Unable to initialize WebGL. Your browser or machine may not support it.");
      return;
  }

  // Set clear color to black, fully opaque
  gl.clearColor(1.0, 0.0, 0.0, 1.0);
  // Clear the color buffer with specified clear color
  gl.clear(gl.COLOR_BUFFER_BIT);
}



function Tab3D () {
  const classes = useStyles();

  return (
      <div className={classes.root}>
        <Drawer
          anchor="left"
          variant="permanent"
          classes={{ paper: classes.drawerPaper }} >          
          <div className={classes.toolbar}/>
          <Button>Button</Button>
        </Drawer>
        <canvas id="can_1" width="640" height="480"></canvas>
        <script src={Init()}></script>
      </div>
  );
}



export default Tab3D;