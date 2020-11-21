import macro from 'vtk.js/Sources/macro';
import vtkInteractorStyleTrackballCamera from 'vtk.js/Sources/Interaction/Style/InteractorStyleTrackballCamera';
import * as vtkMath from 'vtk.js/Sources/Common/Core/Math';
import { ActionType, ActionState } from '../../../../common/types';
import { EventType } from '../../../../common/defines';

// ----------------------------------------------------------------------------
// vtkESInteractorStyle2DMPR methods
// ----------------------------------------------------------------------------

function vtkESInteractorStyle2DMPR(publicAPI, model) {
  model.classHierarchy.push('vtkESInteractorStyle2DMPR');

  const superClass = { ...publicAPI };
  const eventCBs = [];

  publicAPI.handleLeftButtonPress = (callData) => {
    const pos = callData.position;
    model.previousPosition = pos;

    if (model.actionType === ActionType.None) {
      // do nothing
    } else if (model.actionType === ActionType.Zooming) {
      superClass.startDolly();
    } else if (model.actionType === ActionType.Panning) {
      superClass.startPan();
    }
    eventCBs.forEach((eventCB) => {
      eventCB({
        eventType: EventType.MouseDown,
        actionType: model.actionType,
        actionState: ActionState.Start,
      });
    });
  };

  publicAPI.handleRightButtonPress = (callData) => {
    eventCBs.forEach((eventCB) => {
      eventCB({
        eventType: EventType.MouseDown,
        actionType: model.actionType,
        actionState: ActionState.Finish,
      });
    });
  };
  publicAPI.handleStartMouseWheel = (callData) => {
    // change slice
  };

  publicAPI.handleMouseWheel = (callData) => {
    // change slice
  };

  publicAPI.handleEndMouseWheel = () => {
    // change slice
  };

  publicAPI.setCenter = () => {
    const renderer = model.interactor.getCurrentRenderer();
    const camera = renderer.getActiveCamera();
    const dist = camera.getDistance();
    camera.setClippingRange(dist - model.sliceThickness[2] / 2, dist + model.sliceThickness[2] / 2);
  };

  const superSetVolumeMapper = publicAPI.setVolumeMapper;
  publicAPI.setSliceThickness = (thickness) => {
    superSetVolumeMapper(thickness);
    model.sliceThickness = thickness;
    const renderer = model.interactor.getCurrentRenderer();
    const camera = renderer.getActiveCamera();
    camera.setThicknessFromFocalPoint(model.sliceThickness);
  };

  function setSliceNormalInternal(normal) {
    const renderer = model.interactor.getCurrentRenderer();
    const camera = renderer.getActiveCamera();

    const newNormal = [...normal];

    if (model.volumeMapper) {
      vtkMath.normalize(newNormal);

      const center = camera.getFocalPoint();
      const dist = camera.getDistance();

      const cameraPos = [
        center[0] - newNormal[0] * dist,
        center[1] - newNormal[1] * dist,
        center[2] - newNormal[2] * dist,
      ];

      camera.setPosition(...cameraPos);
      camera.setDirectionOfProjection(...newNormal);
    }
  }

  function setViewUpInternal(viewUp) {
    const renderer = model.interactor.getCurrentRenderer();
    const camera = renderer.getActiveCamera();
    camera.setViewUp(...viewUp);
  }

  publicAPI.setSliceOrientation = (normal, viewUp) => {
    setSliceNormalInternal(normal);
    setViewUpInternal(viewUp);
  };

  publicAPI.handleMouseDolly = (renderer, position) => {
    const dy = position.y - model.previousPosition.y;
    const dx = position.x - model.previousPosition.x;
    const rwi = model.interactor;
    const center = rwi.getView().getViewportCenter(renderer);
    const dyf = center[1] !== 0 ? (model.motionFactor * dy) / center[1] : 0;
    const dxf = center[0] !== 0 ? (model.motionFactor * dx) / center[0] : 0;

    const factor = Math.abs(dyf) > Math.abs(dxf) ? dyf : dxf;
    publicAPI.dollyByFactor(renderer, 1.1 ** factor);
  };

  publicAPI.setEventCB = (eventCB) => {
    eventCBs.push(eventCB);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  actionType: '',
  volumeMapper: null,
  sliceThickness: 0,
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  vtkInteractorStyleTrackballCamera.extend(publicAPI, model, initialValues);

  macro.setGet(publicAPI, model, ['actionType', 'volumeMapper', 'sliceThickness']);

  vtkESInteractorStyle2DMPR(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkESInteractorStyle2DMPR');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
