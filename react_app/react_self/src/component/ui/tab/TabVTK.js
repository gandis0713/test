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

import axios from 'axios'

import Button from '@material-ui/core/Button';
import React, { useEffect } from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Box from '@material-ui/core/Box';
import Grid from '@material-ui/core/Grid';

import ReadDicomSeries from '../../../common/utils/DicomReader';
import { TransferFunction } from '../../../common/volume/transferfunction';

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
        },
        framedBox: {
          borderWidth: 2,
          borderColor: '#3f51b5',
          borderStyle: 'solid',
          marginTop: 0
        }
      }
    )
  )
);

function TabVTK () {

  const classes = useStyles();
  let actor;
  let renderWindow;
  let mapper;
  let renderer;

  const callback = function(imageData) {

    mapper.setSampleDistance(0.2);
    actor.getProperty().setScalarOpacityUnitDistance(0, 0.2);
    
    mapper.setInputData(imageData);
    
    renderer.resetCamera();

    alert("Success load dicom")
  }

  const mounted = () => {

    const container = document.getElementById('3d');
    const renderWindowContainer = document.createElement('div');
    container.appendChild(renderWindowContainer);

    // create what we will view
    renderWindow = vtkRenderWindow.newInstance();
    renderer = vtkRenderer.newInstance();
    renderWindow.addRenderer(renderer);
    renderer.setBackground(0.0, 0.0, 0.0);

    actor = vtkVolume.newInstance();

    mapper = vtkVolumeMapper.newInstance();
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
    renderer.getActiveCamera().elevation(20);
  }

  const loadDicom = function() {

    const dicomSeriesDirectory = '/data/dicom/'
    var fileNames = new Array;

    for(let i = 1; i < 10; i++) {
      
      fileNames.push('DCT000' + String(i) + '.dcm')
    }
    for(let i = 10; i < 100; i++) {
      fileNames.push('DCT00' + String(i) + '.dcm')
    }
    // for(let i = 100; i < 400; i++) {
    //   fileNames.push('DCT0' + String(i) + '.dcm')
    // }

    ReadDicomSeries(dicomSeriesDirectory, fileNames, callback)
  }

  const openDicoms = function(event) {
    let data = new FormData;
    for(let i = 0; i < event.target.files.length; i++) {
      data.append(event.target.files[i].name, event.target.files[i]);
    }
    axios.post('/data/dicom', event.target.files[0], {}).then(res => {
      console.log(res.statusText)
    }).catch(res => {
      console.log(res)
    })
  }

  const changeColoring = function(event) {

    actor.getProperty().setRGBTransferFunction(0, TransferFunction.get(event.currentTarget.value).Color());
    actor.getProperty().setScalarOpacity(0, TransferFunction.get(event.currentTarget.value).Opacity());

    const shade = event.currentTarget.value === 'Bone'
    actor.getProperty().setShade(shade);

    renderWindow.render();
  }

  useEffect(mounted);

  return (
      <div className={classes.root}>
        <Drawer
          className={classes.drawer}
          anchor="left"
          variant="permanent"
          classes={{ paper: classes.drawerPaper }} >          
          <div className={classes.toolbar}/>
          <p>VTK Panel</p>
          <input type='file' multiple onChange={openDicoms}/>
          <p>Dicom Load</p>
          <Button onClick={loadDicom}>Load Dicom</Button>          
          <p>Coloring</p>
          <Button value='Teeth' onClick={changeColoring}>Teeth</Button>
          <Button value='Bone' onClick={changeColoring}>Bone</Button>
        </Drawer>   
        <div>          
          <div className={classes.toolbar}/>
          <Box display="flex" flex="1" height="1000px" width='1000px'>
            <Grid container spacing={0}>
              <Grid item xs={6}>
                <Box height='500' width="500" className={classes.framedBox}>
                  <div id='3d'/>
                </Box>
              </Grid>
              <Grid item xs={6}>
                <Box className={classes.framedBox} height="250px" width='250px'>
                  <div id='axial'/>
                </Box>
                <Box className={classes.framedBox} height="250px" width='250px'>
                  <div id='saggital'/>
                </Box>
                <Box className={classes.framedBox} height="250px" width='250px'>
                  <div id='coronal'/>
                </Box>
              </Grid>
            </Grid>
          </Box>
          
        </div>     
      </div>
  );
}

export default TabVTK;