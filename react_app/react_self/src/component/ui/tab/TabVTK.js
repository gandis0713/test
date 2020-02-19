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
import view3D from '../../render/MPR3D'
import viewAxial from '../../render/MPRAxial'
import viewCoronal from '../../render/MPRCoronal'
import viewSaggital from '../../render/MPRSaggital'
import Slider from '@material-ui/core/Slider';

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

  var viewMPR3D;
  var viewMPRAxial;
  var viewMPRCoronal;
  var viewMPRSaggital;

  const callback = function(imageData) {
    
    console.log(imageData.getExtent())
    console.log(imageData.getDimensions())
    console.log(imageData.getBounds())
    console.log(imageData.getDirection())
    console.log(imageData.getCenter())
    viewMPR3D.setImageData(imageData);
    viewMPR3D.setColoring('Teeth')
    viewMPRAxial.setImageData(imageData);
    viewMPRCoronal.setImageData(imageData);
    viewMPRSaggital.setImageData(imageData);

    let sliceAxial = document.getElementById('axialslice');
    let axialRange = viewMPRAxial.getSliceRange()
    sliceAxial.min = axialRange[0];
    sliceAxial.max = axialRange[1];
    sliceAxial.value = viewMPRAxial.getSlice();
    console.log(axialRange)
    console.log(viewMPRAxial.getSlice())
    
    sliceAxial = document.getElementById('coronalslice');
    axialRange = viewMPRCoronal.getSliceRange()
    sliceAxial.min = axialRange[0];
    sliceAxial.max = axialRange[1];
    sliceAxial.value = viewMPRCoronal.getSlice();
    console.log(axialRange)
    console.log(viewMPRCoronal.getSlice())
    
    sliceAxial = document.getElementById('saggitalslice');
    axialRange = viewMPRSaggital.getSliceRange()
    sliceAxial.min = axialRange[0];
    sliceAxial.max = axialRange[1];
    sliceAxial.value = viewMPRSaggital.getSlice();
    console.log(axialRange)
    console.log(viewMPRSaggital.getSlice())

    alert("Success load dicom")
  }

  const mounted = () => {
    viewMPR3D = new view3D();
    viewMPR3D.createViewer(document.getElementById('3d'));
    viewMPRAxial = new viewAxial();
    viewMPRAxial.createViewer(document.getElementById('axial'));
    viewMPRCoronal = new viewCoronal();
    viewMPRCoronal.createViewer(document.getElementById('coronal'));
    viewMPRSaggital = new viewSaggital();
    viewMPRSaggital.createViewer(document.getElementById('saggital'));
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
    for(let i = 100; i < 400; i++) {
      fileNames.push('DCT0' + String(i) + '.dcm')
    }

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
    viewMPR3D.setColoring(event.currentTarget.value);
  }

  useEffect(mounted);

  const changeAxialAxis = (event) => {
    console.log(event.target.value)
    viewMPRAxial.setSlice(event.target.value)
  }

  const changeCoronalAxis = (event) => {
    console.log(event.target.value)
    viewMPRCoronal.setSlice(event.target.value)
  }
  const changeSaggitalAxis = (event) => {
    console.log(event.target.value)
    viewMPRSaggital.setSlice(event.target.value)
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
          <input type='file' multiple onChange={openDicoms}/>
          <p>Dicom Load</p>
          <Button onClick={loadDicom}>Load Dicom</Button>          
          <p>Coloring</p>
          <Button value='Teeth' onClick={changeColoring}>Teeth</Button>
          <Button value='Bone' onClick={changeColoring}>Bone</Button>
          <p>Axis</p>
          <p>Axial</p>
          <input type='range' step='0.2' id='axialslice' onChange={changeAxialAxis}/>
          <p>Coronal</p>
          <input type='range' step='0.2' id='coronalslice' onChange={changeCoronalAxis}/>
          <p>Saggital</p>
          <input type='range' step='0.2' id='saggitalslice' onChange={changeSaggitalAxis}/>
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