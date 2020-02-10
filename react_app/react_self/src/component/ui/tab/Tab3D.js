import React, { useEffect } from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

import { OBJParse } from '../../../common/utils/OBJParser';

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

function Tab3D () {

  const classes = useStyles();

  const initGL = function(e) {
    const canvas = document.getElementById("gl_canvas");
    const gl = canvas.getContext("webgl");

    if (gl === null) {
        alert("Unable to initialize WebGL. Your browser or machine may not support it.");
        return;
    }
    
    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);
  }

  var openFile = function(event) {
    var file = event.target.files[0];
    OBJParse(file, OBJCallBack);
  };

  var OBJCallBack = function(data) {
    alert("Load Finish");
    console.log(data);
  }

  useEffect(initGL);

  return (
      <div className={classes.root}>
        <Drawer
          className={classes.drawer}
          anchor="left"
          variant="permanent"
          classes={{ paper: classes.drawerPaper }} >          
          <div className={classes.toolbar}/>
          <p>3D Panel</p>
          <input type='file' accept='*.stl' onChange={openFile}/>
        </Drawer>
        <div>          
          <div className={classes.toolbar}/>
          <canvas id="gl_canvas" height="540" width="960"></canvas>
        </div>
      </div>
  );
}

export default Tab3D;