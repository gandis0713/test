import React, { useState, useEffect } from 'react';
// eslint-disable-next-line max-len
import vtkInteractorStyleTrackballCamera from 'vtk.js/Sources/Interaction/Style/InteractorStyleTrackballCamera';
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';
import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';
import vtkColorTransferFunction from 'vtk.js/Sources/Rendering/Core/ColorTransferFunction';
import vtkPiecewiseFunction from 'vtk.js/Sources/Common/DataModel/PiecewiseFunction';

import CircularProgress from '@material-ui/core/CircularProgress';
import Typography from '@material-ui/core/Typography';
import { LoadDicomFiles, IResultLoadingDicom } from '../../fileio/dicomLoader';

import openMultiDcmFiles from '../../fileio/openMultiDcmFiles';
import {
  useOpenCTState,
  useOpenCTStartAction,
  useSelectCTAction,
  useOpenCTSuccessAction,
  useLoadingCTAction,
  useOpenCTFailedAction
} from '../../store/hooks/volumeData';
import { actionTypes } from '../../store/actions/volumeData';

function SimpleVolume(): React.ReactElement {
  const [renderer, SetRenderer] = useState<vtkRenderer>();
  const [renderWindow, SetRenderWindow] = useState<vtkRenderWindow>();
  const [mapper, SetMapper] = useState<vtkVolumeMapper>();
  const [actor, SetActor] = useState<vtkVolume>();

  const openCTState = useOpenCTState();
  const onSelectCT = useSelectCTAction();
  const onOpenCTStart = useOpenCTStartAction();
  const onLoadingCT = useLoadingCTAction();
  const onOpenCTSuccess = useOpenCTSuccessAction();
  const onOpenCTFailed = useOpenCTFailedAction();

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
    interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance());

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

    actor.getProperty().setRGBTransferFunction(0, ctfun);
    actor.getProperty().setScalarOpacity(0, ofun);
    actor.getProperty().setScalarOpacityUnitDistance(0, pitchX);

    renderer.resetCamera();
    renderWindow.render();

    onLoadingCT(100);
  }
  const callback = (e: number): void => {
    console.log('event i : ', e);
  };

  function getDcmFiles(e: React.ChangeEvent<HTMLInputElement>): void {
    const webWorker = new Worker('itk/WebWorkers/ImageIO.worker.js');
    webWorker.addEventListener('message', (event: Event): void => {
      console.log(event);
      onLoadingCT(70);
    });

    const { files } = e.target;
    onSelectCT(files);
    if (files) {
      onOpenCTStart();
      onLoadingCT(0);
      // openMultiDcmFiles(files)
      LoadDicomFiles(files, callback)
        .then(imageData => {
          // renderVolume(imageData);
          renderVolume(imageData.data);
          onOpenCTSuccess();
        })
        .catch(error => {
          console.log(error);
          onOpenCTFailed(error);
        });
    } else {
      onOpenCTFailed('Failed to open dicom files.');
    }
  }

  const style: React.CSSProperties = {
    width: '600px',
    height: '600px',
    position: 'relative'
  };

  const circleProgressStyle: React.CSSProperties = {
    color: '#FFFF00',
    position: 'absolute',
    top: '25%',
    left: '25%',
    width: '300px',
    height: '300px'
  };

  const progressStatusStyle: React.CSSProperties = {
    color: '#FFFF00',
    position: 'absolute',
    top: '50%',
    left: '25%',
    width: '300px',
    height: '300px'
  };

  return (
    <div style={style}>
      <div>
        <h4>Simple Volume</h4>
        <p>
          Select Dcm Files:
          <input type="file" accept=".dcm" onChange={getDcmFiles} multiple />
        </p>
        <div ref={container} style={style}>
          {((
            <div>
              <CircularProgress style={circleProgressStyle} />
              <Typography variant="h6" align="center" style={progressStatusStyle}>
                {openCTState.status}
              </Typography>
            </div>
          ) &&
            openCTState.status === actionTypes.LOADING_CT) ||
            openCTState.status === actionTypes.OPEN_CT_START ||
            openCTState.status === actionTypes.SELECT_CT}
        </div>
      </div>
    </div>
  );
}

export default SimpleVolume;
