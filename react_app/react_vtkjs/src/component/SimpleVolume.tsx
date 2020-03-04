import React, { useState, useEffect } from 'react';
// import vtkGenericRenderWindow from 'vtk.js/Sources/Rendering/Misc/GenericRenderWindow';
// import vtkImageMapper from 'vtk.js/Sources/Rendering/Core/ImageMapper';
// import vtkImageSlice from 'vtk.js/Sources/Rendering/Core/ImageSlice';
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
// import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';
// import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';
import vtkInteractorStyleTrackballCamera from 'vtk.js/Sources/Interaction/Style/InteractorStyleTrackballCamera';
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';

import openMultiImageFiles from '../fileio/openMultiImageFiles';

function SimpleVolume(): React.ReactElement {
  // const [renderer, SetRenderer] = useState();
  // const [renderWindow, SetRenderWindow] = useState();

  let actor;
  let renderWindow;
  let mapper;
  let renderer;
  useEffect(() => {
    // create what we will view

    const container = document.getElementById('test');
    const renderWindowContainer = document.createElement('div');
    if (container) {
      container.appendChild(renderWindowContainer);
      console.log('init view');
    }

    renderWindow = vtkRenderWindow.newInstance();
    renderer = vtkRenderer.newInstance();
    renderWindow.addRenderer(renderer);
    renderer.setBackground(0.0, 0.0, 0.0);

    actor = vtkVolume.newInstance();

    mapper = vtkVolumeMapper.newInstance();
    actor.setMapper(mapper);

    // set transfer function for "Teeth"
    const ofun = vtkPiecewiseFunction.newInstance();
    ofun.addPoint(560, 0.0);
    ofun.addPoint(1731, 0.16174);
    ofun.addPoint(3000, 0.21391);

    const ctfun = vtkColorTransferFunction.newInstance();
    ctfun.addRGBPoint(-1000, 0, 0, 0);
    ctfun.addRGBPoint(320, 0.5, 0.08, 0.1);
    ctfun.addRGBPoint(1760, 0.85, 0.7, 0.3);
    ctfun.addRGBPoint(2800, 1, 1, 1);
    ctfun.addRGBPoint(3000, 1, 1, 1);

    actor.getProperty().setRGBTransferFunction(0, ctfun);
    actor.getProperty().setScalarOpacity(0, ofun);

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
    interactor.setInteractorStyle(
      vtkInteractorStyleTrackballCamera.newInstance()
    );

    renderer.addVolume(actor);
    renderer.getActiveCamera().elevation(20);
  }, []);

  const getImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    if (e.target.files) {
      openMultiImageFiles(e.target.files)
        .then(data => {
          const xExtend = data.getExtent()[1] - data.getExtent()[0];
          const xBound = data.getBounds()[1] - data.getBounds()[0];
          const spacing = xBound / xExtend;

          console.log(data);

          mapper.setInputData(data);
          mapper.setSampleDistance(spacing);

          actor.getProperty().setScalarOpacityUnitDistance(0, spacing);

          renderer.resetCamera();

          renderWindow.render();
        })
        .catch(error => {
          console.log(`Failed to open file - ${error.message}`);
        });
    }
  };

  const style: React.CSSProperties = {
    width: '600px',
    height: '600px',
    position: 'relative'
  };

  return (
    <div style={style}>
      <div>
        <h4>Simple Volume</h4>
        <p>
          Select File:
          <input type="file" accept="volume/*" onChange={getImage} multiple />
        </p>
        <div id="test" style={style} />
      </div>
    </div>
  );
}

export default SimpleVolume;
