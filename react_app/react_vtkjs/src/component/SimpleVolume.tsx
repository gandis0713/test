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

import CircularProgress from '@material-ui/core/CircularProgress';
import Button from '@material-ui/core/Button';
import { green } from '@material-ui/core/colors';
import { makeStyles } from '@material-ui/core/styles';

import { localOpenCTActionType } from '../store/actions/volumeData';
import {
  useLocalLoadCTState,
  useLocalSelectCTAction,
  useLocalOpenCTStartAction,
  useLocalOpenCTSucceedAction,
  useLocalOpenCTFailedAction
} from '../store/hooks/volumeData';
import { LocalLoadCTState } from '../store/reducers/volumeData';

const useStyles: any = makeStyles(theme => ({
  root: {
    display: 'flex',
    alignItems: 'center'
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative'
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700]
    }
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12
  }
}));
function SimpleVolume(): React.ReactElement {
  const classes: any = useStyles();

  const localLoadCTState: LocalLoadCTState = useLocalLoadCTState();
  const onCTSelected: Function = useLocalSelectCTAction();
  const onLoadCTStart: Function = useLocalOpenCTStartAction();
  const onLoadCTSucceed: Function = useLocalOpenCTSucceedAction();
  const onLoadCTFailed: Function = useLocalOpenCTFailedAction();

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

  function onLoadLocalCT() {
    if (localLoadCTState.files) {
      onLoadCTStart();
      openMultiDcmFiles(localLoadCTState.files, null)
        .then((imageData: vtkImageData) => {
          renderVolume(imageData);
          onLoadCTSucceed();
        })
        .catch(error => {
          console.log(error);
          onLoadCTFailed();
        });
    }
  }

  function getDcmFiles(e: React.ChangeEvent<HTMLInputElement>): void {
    const { files } = e.target;
    if (files && files.length > 0) {
      onCTSelected(files);
    }
  }

  const style: React.CSSProperties = {
    width: '600px',
    height: '600px',
    position: 'relative'
  };

  const buttonRootStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center'
  };

  return (
    <div style={style}>
      <div>
        <h4>Simple Volume</h4>
        <p>
          Select Dcm Files:
          <input type="file" accept=".dcm" onChange={getDcmFiles} multiple />
        </p>
        <div style={buttonRootStyle}>
          <div className={classes.wrapper}>
            <Button
              variant="contained"
              color="primary"
              className={classes.buttonSuccess}
              disabled={
                localOpenCTActionType.CT_SELECTED !== localLoadCTState.status &&
                (localLoadCTState.files !== null &&
                localLoadCTState.files !== undefined
                  ? localLoadCTState.files.length > 0
                    ? false
                    : true
                  : true)
              }
              onClick={onLoadLocalCT}
            >
              Load CT
            </Button>
            {localOpenCTActionType.LOAD_CT_START ===
              localLoadCTState.status && (
              <CircularProgress size={24} className={classes.buttonProgress} />
            )}
          </div>
        </div>
        <div ref={container} style={style} />
      </div>
    </div>
  );
}

export default SimpleVolume;
