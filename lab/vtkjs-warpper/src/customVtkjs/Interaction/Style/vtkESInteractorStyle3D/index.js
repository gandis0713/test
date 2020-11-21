import macro from 'vtk.js/Sources/macro';
import vtkInteractorStyleTrackballCamera from 'vtk.js/Sources/Interaction/Style/InteractorStyleTrackballCamera';
import { ActionType, ActionState } from '../../../../common/types';
import { EventType } from '../../../../common/defines';

// ----------------------------------------------------------------------------
// vtkESInteractorStyle3D methods
// ----------------------------------------------------------------------------

function vtkESInteractorStyle3D(publicAPI, model) {
  model.classHierarchy.push('vtkESInteractorStyle3D');

  const superClass = { ...publicAPI };
  const eventCBs = [];

  publicAPI.handleLeftButtonPress = (callData) => {
    const pos = callData.position;
    model.previousPosition = pos;

    if (model.actionType === ActionType.None) {
      if (callData.controlKey) {
        superClass.startSpin();
      } else {
        superClass.startRotate();
      }
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

  publicAPI.handleMouseMove = (callData) => {
    superClass.handleMouseMove(callData);
    eventCBs.forEach((eventCB) => {
      eventCB({
        eventType: EventType.MouseMove,
        actionType: model.actionType,
        actionState: ActionState.Start,
      });
    });
  };

  publicAPI.handleRightButtonPress = (callData) => {
    superClass.handleRightButtonPress(callData);
    eventCBs.forEach((eventCB) => {
      eventCB({
        eventType: EventType.MouseDown,
        actionType: model.actionType,
        actionState: ActionState.Finish,
      });
    });
  };

  publicAPI.handleMouseWheel = (callData) => {
    superClass.handleMouseWheel(callData);
    eventCBs.forEach((eventCB) => {
      eventCB({
        eventType: EventType.MouseWheel,
        actionType: model.actionType,
        actionState: ActionState.Start,
      });
    });
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
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  vtkInteractorStyleTrackballCamera.extend(publicAPI, model, initialValues);

  macro.setGet(publicAPI, model, ['actionType']);

  vtkESInteractorStyle3D(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkESInteractorStyle3D');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
