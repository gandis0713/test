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




import React, {useEffect} from 'react';

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

const testSeriesDirectory = '/home/gandis/Desktop/git/prototype/react_app/react_self/data/dicom/'
const fileNames = ['DCT0001.dcm', 'DCT0002.dcm', 'DCT0003.dcm']

function TabVTK () {

  const classes = useStyles();

  const createCone = function() {
    
    ReadDicomSeries(testSeriesDirectory, fileNames)

    const renderWindow = vtkRenderWindow.newInstance();
    const renderer = vtkRenderer.newInstance({ background: [0.2, 0.3, 0.4] });
    renderWindow.addRenderer(renderer);

    // ----------------------------------------------------------------------------
    // Simple pipeline ConeSource --> Mapper --> Actor
    // ----------------------------------------------------------------------------

    const coneSource = vtkConeSource.newInstance({ height: 1.0 });

    const mapper = vtkMapper.newInstance();
    mapper.setInputConnection(coneSource.getOutputPort());

    const actor = vtkActor.newInstance();
    actor.setMapper(mapper);

    // ----------------------------------------------------------------------------
    // Add the actor to the renderer and set the camera based on it
    // ----------------------------------------------------------------------------

    renderer.addActor(actor);
    renderer.resetCamera();

    // ----------------------------------------------------------------------------
    // Use OpenGL as the backend to view the all this
    // ----------------------------------------------------------------------------

    const openglRenderWindow = vtkOpenGLRenderWindow.newInstance();
    renderWindow.addView(openglRenderWindow);

    // ----------------------------------------------------------------------------
    // Create a div section to put this into
    // ----------------------------------------------------------------------------

    const container = document.getElementById('VTK');
    openglRenderWindow.setContainer(container);

    // ----------------------------------------------------------------------------
    // Capture size of the container and set it to the renderWindow
    // ----------------------------------------------------------------------------

    const { width, height } = container.getBoundingClientRect();
    openglRenderWindow.setSize(width, height);

    // ----------------------------------------------------------------------------
    // Setup an interactor to handle mouse events
    // ----------------------------------------------------------------------------

    const interactor = vtkRenderWindowInteractor.newInstance();
    interactor.setView(openglRenderWindow);
    interactor.initialize();
    interactor.bindEvents(container);

    // // ----------------------------------------------------------------------------
    // // Setup interactor style to use
    // // ----------------------------------------------------------------------------

    // interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance());
  }

  useEffect(createCone)

  return (
      <div className={classes.root}>
        <Drawer
          className={classes.drawer}
          anchor="left"
          variant="permanent"
          classes={{ paper: classes.drawerPaper }} >          
          <div className={classes.toolbar}/>
          <p>VTK Panel</p>
        </Drawer>   
        <div>          
          <div className={classes.toolbar}/>
          <div id="VTK"/>
        </div>     
      </div>
  );
}

export default TabVTK;