import React, { useState, useEffect } from 'react';

import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';
// eslint-disable-next-line max-len
import vtkInteractorStyleTrackballCamera from 'vtk.js/Sources/Interaction/Style/InteractorStyleTrackballCamera';
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction';

import { LoadDicomFiles, IResultLoadingDicom } from '../../fileio/dicomLoader';

const style: React.CSSProperties = {
  width: '600px',
  height: '600px',
  position: 'relative'
};

const container = React.createRef<HTMLDivElement>();

function MultiVolumeText(): React.ReactElement {
  const [renderer, SetRenderer] = useState<vtkRenderer>();
  const [renderWindow, SetRenderWindow] = useState<vtkRenderWindow>();
  const [mapper2, SetMapper2] = useState<vtkVolumeMapper>();
  const [actor2, SetActor2] = useState<vtkVolume>();
  const [mapper1, SetMapper1] = useState<vtkVolumeMapper>();
  const [actor1, SetActor1] = useState<vtkVolume>();

  const componentMounted = (): void => {
    console.log('MultiVolumeText was mounted');

    const currentContainer: HTMLDivElement | null = container.current;
    if (!currentContainer) {
      console.log('HTMLDivElement container instance is null');
      return;
    }

    const newRenderWindow = vtkRenderWindow.newInstance();
    const newRenderer = vtkRenderer.newInstance();
    newRenderer.setBackground(0.0, 0.0, 0.0);
    newRenderWindow.addRenderer(newRenderer);

    const glWindow: vtkOpenGLRenderWindow = vtkOpenGLRenderWindow.newInstance();
    glWindow.setContainer(currentContainer);
    glWindow.setSize(600, 600);
    newRenderWindow.addView(glWindow);

    const interactor: vtkRenderWindowInteractor = vtkRenderWindowInteractor.newInstance();
    interactor.setStillUpdateRate(0.01);
    interactor.setView(glWindow);
    interactor.initialize();
    interactor.bindEvents(currentContainer);
    interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance());

    newRenderer.getActiveCamera().elevation(20);

    const newMapper1 = vtkVolumeMapper.newInstance();
    const newActor1 = vtkVolume.newInstance();
    newActor1.setMapper(newMapper1);

    const newMapper2 = vtkVolumeMapper.newInstance();
    const newActor2 = vtkVolume.newInstance();
    newActor2.setMapper(newMapper2);

    SetRenderWindow(newRenderWindow);
    SetRenderer(newRenderer);

    SetMapper2(newMapper2);
    SetActor2(newActor2);

    SetMapper1(newMapper1);
    SetActor1(newActor1);
  };
  useEffect(componentMounted, []);

  const callback = (i: number): void => {
    console.log('percent : ', i);
  };

  function getDcmFiles1(e: React.ChangeEvent<HTMLInputElement>): void {
    const { files } = e.target;
    if (files) {
      LoadDicomFiles(files, callback)
        // openMultiDcmFiles(files)
        .then((result: IResultLoadingDicom) => {
          const imageData: vtkImageData = result.data;
          renderer.addVolume(actor1);
          mapper1.setInputData(imageData);

          const extentX: number = imageData.getExtent()[1] - imageData.getExtent()[0];
          const boundX: number = imageData.getBounds()[1] - imageData.getBounds()[0];
          const pitchX: number = boundX / extentX;

          mapper1.setSampleDistance(pitchX);

          const transFuncBone = vtkColorTransferFunction.newInstance();
          transFuncBone.addRGBPoint(-1000, 0, 0, 0);
          transFuncBone.addRGBPoint(788, 0.627, 0.102, 0.086);
          transFuncBone.addRGBPoint(1090, 0.992, 0.886, 0.576);
          transFuncBone.addRGBPoint(1247, 1, 1, 1);
          transFuncBone.addRGBPoint(3000, 1, 1, 1);
          const opaFuncBone = vtkPiecewiseFunction.newInstance();
          opaFuncBone.addPoint(752, 0.0);
          opaFuncBone.addPoint(1151, 0.71304);
          opaFuncBone.addPoint(3000, 1.0);

          actor1.getProperty().setRGBTransferFunction(0, transFuncBone);
          actor1.getProperty().setScalarOpacity(0, opaFuncBone);
          actor1.getProperty().setScalarOpacityUnitDistance(0, pitchX);

          renderer.resetCamera();
          renderWindow.render();
        });
    }
  }

  function getDcmFiles2(e: React.ChangeEvent<HTMLInputElement>): void {
    const { files } = e.target;
    if (files) {
      LoadDicomFiles(files, callback)
        // openMultiDcmFiles(files)
        .then((result: IResultLoadingDicom) => {
          const imageData: vtkImageData = result.data;
          renderer.addVolume(actor2);
          mapper2.setInputData(imageData);

          const extentX: number = imageData.getExtent()[1] - imageData.getExtent()[0];
          const boundX: number = imageData.getBounds()[1] - imageData.getBounds()[0];
          const pitchX: number = boundX / extentX;

          mapper2.setSampleDistance(pitchX);

          const ctfun = vtkColorTransferFunction.newInstance();
          ctfun.addRGBPoint(-1000, 0, 0, 0);
          ctfun.addRGBPoint(320, 0.522, 0.078, 0.09);
          ctfun.addRGBPoint(1760, 0.859, 0.667, 0.294);
          ctfun.addRGBPoint(2800, 1.0, 1.0, 1.0);
          ctfun.addRGBPoint(3000, 1.0, 1.0, 1.0);
          const ofun = vtkPiecewiseFunction.newInstance();
          ofun.addPoint(560, 0.0);
          ofun.addPoint(1731, 0.3274);
          ofun.addPoint(3000, 0.42391);

          actor2.getProperty().setRGBTransferFunction(0, ctfun);
          actor2.getProperty().setScalarOpacity(0, ofun);
          actor2.getProperty().setScalarOpacityUnitDistance(0, pitchX);

          renderer.resetCamera();
          renderWindow.render();
        });
    }
  }

  return (
    <div>
      <input type="file" accept=".dcm" onChange={getDcmFiles1} multiple />
      <input type="file" accept=".dcm" onChange={getDcmFiles2} multiple />
      <div ref={container} style={style} />
    </div>
  );
}

export default MultiVolumeText;
