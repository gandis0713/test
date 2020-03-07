import React, { useState, useEffect } from 'react';
import vtkInteractorStyleTrackballCamera from 'vtk.js/Sources/Interaction/Style/InteractorStyleTrackballCamera';
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';
import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import openMultiDcmFiles from '../fileio/openMultiDcmFiles';

function SimpleVolume(): React.ReactElement {
  const [renderer, SetRenderer] = useState();
  const [renderWindow, SetRenderWindow] = useState();
  const [mapper, SetMapper] = useState();
  const [actor, SetActor] = useState();

  const container = React.createRef<HTMLDivElement>();

  function componentMounted(): void {
    console.log('SimpleVolume was mounted');

    const currentContainer: HTMLDivElement | null = container.current;
    if (!currentContainer) {
      console.log('HTMLDivElement container instance is null');
      return;
    }

    const newRenderWindow = vtkRenderWindow.newInstance();
    const newRenderer = vtkRenderer.newInstance();
    newRenderer.setBackground(0.0, 0.0, 0.0);
    newRenderWindow.addRenderer(newRenderer);

    const newMapper = vtkVolumeMapper.newInstance();
    const newActor = vtkVolume.newInstance();

    newActor.setMapper(newMapper);

    const glWindow: vtkOpenGLRenderWindow = vtkOpenGLRenderWindow.newInstance();
    glWindow.setContainer(currentContainer);
    glWindow.setSize(600, 600);
    newRenderWindow.addView(glWindow);

    const interactor: vtkRenderWindowInteractor = vtkRenderWindowInteractor.newInstance();
    interactor.setStillUpdateRate(0.01);
    interactor.setView(glWindow);
    interactor.initialize();
    interactor.bindEvents(currentContainer);
    interactor.setInteractorStyle(
      vtkInteractorStyleTrackballCamera.newInstance()
    );

    newRenderer.addVolume(newActor);
    newRenderer.getActiveCamera().elevation(20);

    SetRenderWindow(newRenderWindow);
    SetRenderer(newRenderer);
    SetMapper(newMapper);
    SetActor(newActor);
  }
  useEffect(componentMounted, []);

  function renderVolume(imageData: vtkImageData): void {
    if (!mapper || !actor || !renderWindow || !renderer) {
      console.log('failed to render volume.');
      return;
    }

    mapper.setInputData(imageData);

    const extentX: number = imageData.getExtent()[1] - imageData.getExtent()[0];
    const boundX: number = imageData.getBounds()[1] - imageData.getBounds()[0];
    const pitchX: number = boundX / extentX;

    mapper.setSampleDistance(pitchX);
    actor.getProperty().setScalarOpacityUnitDistance(0, pitchX);

    renderer.resetCamera();
  }

  function getDcmFiles(e: React.ChangeEvent<HTMLInputElement>): void {
    const webWorker = new Worker('itk/WebWorkers/ImageIO.worker.js');
    webWorker.addEventListener('message', (event: Event): void => {
      console.log(event);
    });

    const { files } = e.target;
    console.log(files);
    if (files) {
      openMultiDcmFiles(files, webWorker)
        .then((imageData: vtkImageData) => {
          renderVolume(imageData);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

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
          Select Dcm Files:
          <input type="file" accept=".dcm" onChange={getDcmFiles} multiple />
        </p>
        <div ref={container} style={style} />
      </div>
    </div>
  );
}

export default SimpleVolume;
