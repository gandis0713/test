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
import vtkInteractorStyleMPRSlice from 'vtk.js/Sources/Interaction/Style/InteractorStyleMPRSlice';

import { TransferFunction } from '../../common/volume/transferfunction';

function viewCoronal() {

  let actor;
  let renderWindow;
  let mapper;
  let renderer;
  let istyle;

  this.createViewer = (container) => {
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
    glwindow.setSize(1000, 1000);

    istyle = vtkInteractorStyleMPRSlice.newInstance();

    const interactor = vtkRenderWindowInteractor.newInstance();
    interactor.setStillUpdateRate(0.01);
    interactor.setView(glwindow);
    interactor.initialize();
    interactor.setInteractorStyle(istyle);

    renderer.addVolume(actor);   
    renderWindow.render(); 
  }

  this.setImageData = (imageData) => {
    // mapper.setSampleDistance(0.2);
    // actor.getProperty().setScalarOpacityUnitDistance(0, 0.2);
    
    mapper.setInputData(imageData);

    istyle.setVolumeMapper(mapper);
    istyle.setSliceNormal(0, 1, 0);
    const range = istyle.getSliceRange();
    istyle.setSlice((range[0] + range[1]) / 2);
    
    renderer.resetCamera();
    renderWindow.render();
  }

  this.getSliceRange = () => {
    return istyle.getSliceRange()
  }

  this.getSlice = () => {
    return istyle.getSlice()
  }

  this.setSlice = (value) => {
    istyle.setSlice(Number(value));
    renderWindow.render();
  }
}

export default viewCoronal;