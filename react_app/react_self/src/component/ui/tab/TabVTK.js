import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';
import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';
import vtkInteractorStyleTrackballCamera from 'vtk.js/Sources/Interaction/Style/InteractorStyleTrackballCamera';
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';

// ----------------------------------------------------------------------------
// Standard rendering code setup
// ----------------------------------------------------------------------------


import Button from '@material-ui/core/Button';


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

function TabVTK () {

  const classes = useStyles();

  const callback = function(id) {
    console.log("finish")

    const container = document.getElementById('VTK');
    const renderWindowContainer = document.createElement('div');
    container.appendChild(renderWindowContainer);

    // create what we will view
    const renderWindow = vtkRenderWindow.newInstance();
    const renderer = vtkRenderer.newInstance();
    renderWindow.addRenderer(renderer);
    renderer.setBackground(0.0, 0.0, 0.0);

    const actor = vtkVolume.newInstance();

    const mapper = vtkVolumeMapper.newInstance();
    mapper.setSampleDistance(0.7);
    actor.setMapper(mapper);

    // now create something to view it, in this case webgl
    const glwindow = vtkOpenGLRenderWindow.newInstance();
    glwindow.setContainer(renderWindowContainer);
    renderWindow.addView(glwindow);
    glwindow.setSize(800, 800);

    // Interactor
    const interactor = vtkRenderWindowInteractor.newInstance();
    interactor.setStillUpdateRate(0.01);
    interactor.setView(glwindow);
    interactor.initialize();
    interactor.bindEvents(renderWindowContainer);
    interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance());

    renderer.addVolume(actor);

    const ofun = vtkPiecewiseFunction.newInstance();
    ofun.addPoint(-3024, 0.1);
    ofun.addPoint(-637.62, 0.1);
    ofun.addPoint(700, 0.5);
    ofun.addPoint(3071, 0.9);


    const ctfun = vtkColorTransferFunction.newInstance();
    ctfun.addRGBPoint(-3024, 0, 0, 0);
    ctfun.addRGBPoint(-637.62, 0, 0, 0);
    ctfun.addRGBPoint(700, 1, 1, 1);
    ctfun.addRGBPoint(3071, 1, 1, 1);
    
    actor.getProperty().setRGBTransferFunction(0, ctfun);
    actor.getProperty().setScalarOpacity(0, ofun);
    actor.getProperty().setScalarOpacityUnitDistance(0, 3.0);
    actor.getProperty().setInterpolationTypeToLinear();
    actor.getProperty().setShade(true);
    actor.getProperty().setAmbient(0.1);
    actor.getProperty().setDiffuse(0.9);
    actor.getProperty().setSpecular(0.2);
    actor.getProperty().setSpecularPower(10.0);

    mapper.setInputData(id);
    renderer.resetCamera();
    renderer.getActiveCamera().elevation(20);
    renderWindow.render();
  }

  const openFile = function() {

    const dicomSeriesDirectory = '/data/dicom/'
    var fileNames = new Array;

    for(let i = 1; i < 10; i++) {
      
      fileNames.push('DCT000' + String(i) + '.dcm')
    }
    for(let i = 10; i < 100; i++) {
      fileNames.push('DCT00' + String(i) + '.dcm')
    }
    for(let i = 100; i < 400; i++) {
      fileNames.push('DCT0' + String(i) + '.dcm')
    }

    ReadDicomSeries(dicomSeriesDirectory, fileNames, callback)
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
          <Button onClick={openFile}>Load Dicom</Button>
        </Drawer>   
        <div>          
          <div className={classes.toolbar}/>
          <div id="VTK"/>
        </div>     
      </div>
  );
}

export default TabVTK;