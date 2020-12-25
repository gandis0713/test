import macro from 'vtk.js/Sources/macro';
import vtkInteractorStyle from 'vtk.js/Sources/Rendering/Core/InteractorStyle';
import vtkInteractorStyleConstants from 'vtk.js/Sources/Rendering/Core/InteractorStyle/Constants';
import * as vtkMath from 'vtk.js/Sources/Common/Core/Math';
import { Device, Input } from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor/Constants';
import { ViewTypes } from 'vtk.js/Sources/Widgets/Core/WidgetManager/Constants';

const { States } = vtkInteractorStyleConstants;

/* eslint-disable no-lonely-if */

// ----------------------------------------------------------------------------
// vtkInteractorStyleMPR methods
// ----------------------------------------------------------------------------

function vtkInteractorStyleMPR(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkInteractorStyleMPR');

  // Public API methods
  publicAPI.handleMouseMove = callData => {
    const viewType = callData.pokedRenderer.getViewType();
    switch (viewType) {
      case ViewTypes.VOLUME:
        {
          const pos = callData.position;
          const renderer = callData.pokedRenderer;

          switch (model.state) {
            case States.IS_ROTATE:
              publicAPI.handleMouseRotate(renderer, pos);
              publicAPI.invokeInteractionEvent({ type: 'InteractionEvent' });
              publicAPI.invokeRotateEvent({ type: 'RotateEvent' });
              break;

            case States.IS_PAN:
              publicAPI.handleMousePan(renderer, pos);
              publicAPI.invokeInteractionEvent({ type: 'InteractionEvent' });
              break;

            case States.IS_DOLLY:
              publicAPI.handleMouseDolly(renderer, pos);
              publicAPI.invokeInteractionEvent({ type: 'InteractionEvent' });
              break;

            case States.IS_SPIN:
              publicAPI.handleMouseSpin(renderer, pos);
              publicAPI.invokeInteractionEvent({ type: 'InteractionEvent' });
              break;

            default:
              break;
          }

          model.previousPosition = pos;
        }
        break;
      case ViewTypes.CORONAL:
      case ViewTypes.SAGITTAL:
      case ViewTypes.AXIAL:
        {
        }
        break;
      default:
        break;
    }
  };

  //----------------------------------------------------------------------------
  publicAPI.handleLeftButtonPress = callData => {
    const viewType = callData.pokedRenderer.getViewType();
    switch (viewType) {
      case ViewTypes.VOLUME:
        {
          const pos = callData.position;
          model.previousPosition = pos;

          if (callData.shiftKey) {
            if (callData.controlKey || callData.altKey) {
              publicAPI.startDolly();
            } else {
              publicAPI.startPan();
            }
          } else {
            if (callData.controlKey || callData.altKey) {
              publicAPI.startSpin();
            } else {
              publicAPI.startRotate();
              publicAPI.invokeRotateEvent({ type: 'StartRotateEvent' });
            }
          }
        }
        break;
      case ViewTypes.CORONAL:
      case ViewTypes.SAGITTAL:
      case ViewTypes.AXIAL:
        {
        }
        break;
      default:
        break;
    }
  };

  //--------------------------------------------------------------------------
  publicAPI.handleLeftButtonRelease = callData => {
    const viewType = callData.pokedRenderer.getViewType();
    switch (viewType) {
      case ViewTypes.VOLUME:
        {
          switch (model.state) {
            case States.IS_DOLLY:
              publicAPI.endDolly();
              break;
            case States.IS_PAN:
              publicAPI.endPan();
              break;
            case States.IS_SPIN:
              publicAPI.endSpin();
              break;
            case States.IS_ROTATE:
              publicAPI.endRotate();
              publicAPI.invokeRotateEvent({ type: 'EndRotateEvent' });
              break;

            default:
              break;
          }
        }
        break;
      case ViewTypes.CORONAL:
      case ViewTypes.SAGITTAL:
      case ViewTypes.AXIAL:
        {
        }
        break;
      default:
        break;
    }
  };

  //----------------------------------------------------------------------------
  publicAPI.handleStartMouseWheel = callData => {
    const viewType = callData.pokedRenderer.getViewType();
    switch (viewType) {
      case ViewTypes.VOLUME:
        {
          publicAPI.startDolly();
          publicAPI.handleMouseWheel(callData);
          return macro.EVENT_ABORT;
        }
        break;
      case ViewTypes.CORONAL:
      case ViewTypes.SAGITTAL:
      case ViewTypes.AXIAL:
        {
        }
        break;
      default:
        break;
    }
  };

  //--------------------------------------------------------------------------
  publicAPI.handleEndMouseWheel = callData => {
    const viewType = callData.pokedRenderer.getViewType();
    switch (viewType) {
      case ViewTypes.VOLUME:
        {
          publicAPI.endDolly();
          return macro.EVENT_ABORT;
        }
        break;
      case ViewTypes.CORONAL:
      case ViewTypes.SAGITTAL:
      case ViewTypes.AXIAL:
        {
        }
        break;
      default:
        break;
    }
  };

  //----------------------------------------------------------------------------
  publicAPI.handleStartPinch = callData => {
    model.previousScale = callData.scale;
    publicAPI.startDolly();
  };

  //--------------------------------------------------------------------------
  publicAPI.handleEndPinch = () => {
    publicAPI.endDolly();
  };

  //----------------------------------------------------------------------------
  publicAPI.handleStartRotate = callData => {
    model.previousRotation = callData.rotation;
    publicAPI.startRotate();
  };

  //--------------------------------------------------------------------------
  publicAPI.handleEndRotate = () => {
    publicAPI.endRotate();
  };

  //----------------------------------------------------------------------------
  publicAPI.handleStartPan = callData => {
    model.previousTranslation = callData.translation;
    publicAPI.startPan();
  };

  //--------------------------------------------------------------------------
  publicAPI.handleEndPan = () => {
    publicAPI.endPan();
  };

  //----------------------------------------------------------------------------
  publicAPI.handlePinch = callData => {
    publicAPI.dollyByFactor(callData.pokedRenderer, callData.scale / model.previousScale);
    model.previousScale = callData.scale;
  };

  //----------------------------------------------------------------------------
  publicAPI.handlePan = callData => {
    const camera = callData.pokedRenderer.getActiveCamera();

    // Calculate the focal depth since we'll be using it a lot
    let viewFocus = camera.getFocalPoint();

    viewFocus = publicAPI.computeWorldToDisplay(
      callData.pokedRenderer,
      viewFocus[0],
      viewFocus[1],
      viewFocus[2]
    );
    const focalDepth = viewFocus[2];

    const trans = callData.translation;
    const lastTrans = model.previousTranslation;
    const newPickPoint = publicAPI.computeDisplayToWorld(
      callData.pokedRenderer,
      viewFocus[0] + trans[0] - lastTrans[0],
      viewFocus[1] + trans[1] - lastTrans[1],
      focalDepth
    );

    // Has to recalc old mouse point since the viewport has moved,
    // so can't move it outside the loop
    const oldPickPoint = publicAPI.computeDisplayToWorld(
      callData.pokedRenderer,
      viewFocus[0],
      viewFocus[1],
      focalDepth
    );

    // Camera motion is reversed
    const motionVector = [];
    motionVector[0] = oldPickPoint[0] - newPickPoint[0];
    motionVector[1] = oldPickPoint[1] - newPickPoint[1];
    motionVector[2] = oldPickPoint[2] - newPickPoint[2];

    viewFocus = camera.getFocalPoint();
    const viewPoint = camera.getPosition();
    camera.setFocalPoint(
      motionVector[0] + viewFocus[0],
      motionVector[1] + viewFocus[1],
      motionVector[2] + viewFocus[2]
    );

    camera.setPosition(
      motionVector[0] + viewPoint[0],
      motionVector[1] + viewPoint[1],
      motionVector[2] + viewPoint[2]
    );

    if (model.interactor.getLightFollowCamera()) {
      callData.pokedRenderer.updateLightsGeometryToFollowCamera();
    }

    camera.orthogonalizeViewUp();

    model.previousTranslation = callData.translation;
  };

  //----------------------------------------------------------------------------
  publicAPI.handleRotate = callData => {
    const camera = callData.pokedRenderer.getActiveCamera();
    camera.roll(callData.rotation - model.previousRotation);
    camera.orthogonalizeViewUp();
    model.previousRotation = callData.rotation;
  };

  //--------------------------------------------------------------------------
  publicAPI.handleMouseRotate = (renderer, position) => {
    const rwi = model.interactor;

    const dx = position.x - model.previousPosition.x;
    const dy = position.y - model.previousPosition.y;

    const size = rwi.getView().getViewportSize(renderer);

    let deltaElevation = -0.1;
    let deltaAzimuth = -0.1;
    if (size[0] && size[1]) {
      deltaElevation = -20.0 / size[1];
      deltaAzimuth = -20.0 / size[0];
    }

    const rxf = dx * deltaAzimuth * model.motionFactor;
    const ryf = dy * deltaElevation * model.motionFactor;

    const camera = renderer.getActiveCamera();
    if (!Number.isNaN(rxf) && !Number.isNaN(ryf)) {
      camera.azimuth(rxf);
      camera.elevation(ryf);
      camera.orthogonalizeViewUp();
    }

    if (model.autoAdjustCameraClippingRange) {
      renderer.resetCameraClippingRange();
    }

    if (rwi.getLightFollowCamera()) {
      renderer.updateLightsGeometryToFollowCamera();
    }
  };

  publicAPI.handleButton3D = ed => {
    if (ed && ed.pressed && ed.device === Device.RightController && ed.input === Input.TrackPad) {
      publicAPI.startCameraPose();
      return;
    }
    if (
      ed &&
      !ed.pressed &&
      ed.device === Device.RightController &&
      ed.input === Input.TrackPad &&
      model.state === States.IS_CAMERA_POSE
    ) {
      publicAPI.endCameraPose();
      // return;
    }
  };

  publicAPI.handleMove3D = ed => {
    switch (model.state) {
      case States.IS_CAMERA_POSE:
        publicAPI.updateCameraPose(ed);
        break;
      default:
    }
  };

  //--------------------------------------------------------------------------
  publicAPI.handleMouseSpin = (renderer, position) => {
    const rwi = model.interactor;
    const camera = renderer.getActiveCamera();
    const center = rwi.getView().getViewportCenter(renderer);

    const oldAngle = vtkMath.degreesFromRadians(
      Math.atan2(model.previousPosition.y - center[1], model.previousPosition.x - center[0])
    );
    const newAngle =
      vtkMath.degreesFromRadians(Math.atan2(position.y - center[1], position.x - center[0])) -
      oldAngle;

    if (!Number.isNaN(newAngle)) {
      camera.roll(newAngle);
      camera.orthogonalizeViewUp();
    }
  };

  //--------------------------------------------------------------------------
  publicAPI.handleMousePan = (renderer, position) => {
    const camera = renderer.getActiveCamera();

    // Calculate the focal depth since we'll be using it a lot
    let viewFocus = camera.getFocalPoint();
    viewFocus = publicAPI.computeWorldToDisplay(renderer, viewFocus[0], viewFocus[1], viewFocus[2]);
    const focalDepth = viewFocus[2];

    const newPickPoint = publicAPI.computeDisplayToWorld(
      renderer,
      position.x,
      position.y,
      focalDepth
    );

    // Has to recalc old mouse point since the viewport has moved,
    // so can't move it outside the loop
    const oldPickPoint = publicAPI.computeDisplayToWorld(
      renderer,
      model.previousPosition.x,
      model.previousPosition.y,
      focalDepth
    );

    // Camera motion is reversed
    const motionVector = [];
    motionVector[0] = oldPickPoint[0] - newPickPoint[0];
    motionVector[1] = oldPickPoint[1] - newPickPoint[1];
    motionVector[2] = oldPickPoint[2] - newPickPoint[2];

    viewFocus = camera.getFocalPoint();
    const viewPoint = camera.getPosition();
    camera.setFocalPoint(
      motionVector[0] + viewFocus[0],
      motionVector[1] + viewFocus[1],
      motionVector[2] + viewFocus[2]
    );

    camera.setPosition(
      motionVector[0] + viewPoint[0],
      motionVector[1] + viewPoint[1],
      motionVector[2] + viewPoint[2]
    );

    if (model.interactor.getLightFollowCamera()) {
      renderer.updateLightsGeometryToFollowCamera();
    }
  };

  //----------------------------------------------------------------------------
  publicAPI.handleMouseDolly = (renderer, position) => {
    const dy = position.y - model.previousPosition.y;
    const rwi = model.interactor;
    const center = rwi.getView().getViewportCenter(renderer);
    const dyf = (model.motionFactor * dy) / center[1];

    publicAPI.dollyByFactor(renderer, 1.1 ** dyf);
  };

  //----------------------------------------------------------------------------
  publicAPI.handleMouseWheel = callData => {
    const viewType = callData.pokedRenderer.getViewType();
    switch (viewType) {
      case ViewTypes.VOLUME:
        {
          const dyf = 1 - callData.spinY / 10; // divide by 10 to lower the zoom factor
          publicAPI.dollyByFactor(callData.pokedRenderer, dyf);
          return macro.EVENT_ABORT;
        }
        break;
      case ViewTypes.CORONAL:
      case ViewTypes.SAGITTAL:
      case ViewTypes.AXIAL:
        {
        }
        break;
      default:
        break;
    }
  };

  //----------------------------------------------------------------------------
  publicAPI.dollyByFactor = (renderer, factor) => {
    if (Number.isNaN(factor)) {
      return;
    }

    const camera = renderer.getActiveCamera();
    if (camera.getParallelProjection()) {
      camera.setParallelScale(camera.getParallelScale() / factor);
    } else {
      camera.dolly(factor);
      if (model.autoAdjustCameraClippingRange) {
        renderer.resetCameraClippingRange();
      }
    }

    if (model.interactor.getLightFollowCamera()) {
      renderer.updateLightsGeometryToFollowCamera();
    }
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  motionFactor: 10.0
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkInteractorStyle.extend(publicAPI, model, initialValues);

  // Create get-set macros
  macro.setGet(publicAPI, model, ['motionFactor']);
  macro.event(publicAPI, model, 'RotateEvent');

  // For more macro methods, see "Sources/macro.js"

  // Object specific methods
  vtkInteractorStyleMPR(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkInteractorStyleMPR');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
