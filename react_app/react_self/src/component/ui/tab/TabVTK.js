import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkConeSource from 'vtk.js/Sources/Filters/Sources/ConeSource';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkInteractorStyleTrackballCamera from 'vtk.js/Sources/Interaction/Style/InteractorStyleTrackballCamera';

// ----------------------------------------------------------------------------
// Standard rendering code setup
// ----------------------------------------------------------------------------




import React from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';

import ReadDicomSeries from '../../../common/utils/DicomReader'

const useStyles = makeStyles (
  theme => (
    createStyles (
      {
        root: {
          display: "flex"
        },
        toolbar: theme.mixins.toolbar,
        drawer: {
          width: 240,
          flexShrink: 0,
        },
        drawerPaper: {
          width: 240,
        }
      }
    )
  )
);

const dicomSeriesDirectory = '/data/dicom/'
const fileNames = ['DCT0001.dcm', 'DCT0002.dcm', 'DCT0003.dcm']

function TabVTK () {

  const classes = useStyles();

  const openFile = function() {    
    ReadDicomSeries(dicomSeriesDirectory, fileNames)
  }

  return (
      <div className={classes.root}>
        <Drawer
          className={classes.drawer}
          anchor="left"
          variant="permanent"
          classes={{ paper: classes.drawerPaper }} >          
          <div className={classes.toolbar}/>
          <p>VTK Panel</p>
          <input type='file' onChange={openFile}/>
        </Drawer>   
        <div>          
          <div className={classes.toolbar}/>
          <div id="VTK"/>
        </div>     
      </div>
  );
}

export default TabVTK;