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

import { TransferFunction } from '../../common/volume/transferfunction';

function view3D() {

  let actor;
  let renderWindow;
  let mapper;
  let renderer;

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

  this.setColoring = (mode) => {
    console.log(mode)
    actor.getProperty().setRGBTransferFunction(0, TransferFunction.get(mode).Color());
    actor.getProperty().setScalarOpacity(0, TransferFunction.get(mode).Opacity());

    const shade = mode === 'Bone'
    actor.getProperty().setShade(shade);

    renderWindow.render();
  }

  this.setImageData = (imageData) => {
    mapper.setSampleDistance(0.2);
    actor.getProperty().setScalarOpacityUnitDistance(0, 0.2);
    
    mapper.setInputData(imageData);
    
    renderer.resetCamera();
  }
}

export default view3D;