import macro from 'vtk.js/Sources/macro';
import vtkLabelRepresentation from 'vtk.js/Sources/Interaction/Widgets/LabelRepresentation';
import vtkBoundingBox from 'vtk.js/Sources/Common/DataModel/BoundingBox';
import {
  TextAlign,
  VerticalAlign,
} from 'vtk.js/Sources/Interaction/Widgets/LabelRepresentation/Constants';
import { distance2BetweenPoints } from 'vtk.js/Sources/Common/Core/Math';
import { ActionState } from '../../../../common/types';
import { EventType } from '../../../../common/defines';

const MAX_POINTS = 2;

export default function widgetBehavior(publicAPI, model) {
  model.classHierarchy.push('vtkDistanceWidgetProp');
  const eventCBs = [];
  let isDragging = null;

  // --------------------------------------------------------------------------
  // Display 2D
  // --------------------------------------------------------------------------

  publicAPI.setDisplayCallback = (callback) =>
    model.representations[0].setDisplayCallback(callback);

  // --------------------------------------------------------------------------
  // Interactor events
  // --------------------------------------------------------------------------

  function ignoreKey(e) {
    return e.altKey || e.controlKey || e.shiftKey;
  }

  // --------------------------------------------------------------------------
  // Left press: Select handle to drag
  // --------------------------------------------------------------------------

  publicAPI.handleLeftButtonPress = (e) => {
    if (!model.activeState || !model.activeState.getActive() || !model.pickable || ignoreKey(e)) {
      return macro.VOID;
    }

    if (
      model.activeState === model.widgetState.getMoveHandle() &&
      model.widgetState.getHandleList().length < MAX_POINTS
    ) {
      model.activeState.setVisible(true);

      // Commit handle to location
      const moveHandle = model.widgetState.getMoveHandle();
      const newHandle = model.widgetState.addHandle();
      newHandle.setOrigin(...moveHandle.getOrigin());
      newHandle.setColor(moveHandle.getColor());
      newHandle.setScale1(moveHandle.getScale1());
    } else {
      isDragging = true;
      model.openGLRenderWindow.setCursor('grabbing');
      model.interactor.requestAnimation(publicAPI);
    }

    publicAPI.invokeStartInteractionEvent();
    return macro.EVENT_ABORT;
  };

  // --------------------------------------------------------------------------
  // Mouse move: Drag selected handle / Handle follow the mouse
  // --------------------------------------------------------------------------

  publicAPI.handleMouseMove = (callData) => {
    if (
      model.pickable &&
      model.manipulator &&
      model.activeState &&
      model.activeState.getActive() &&
      !ignoreKey(callData)
    ) {
      model.manipulator.setOrigin(model.activeState.getOrigin());
      model.manipulator.setNormal(model.camera.getDirectionOfProjection());
      const worldCoords = model.manipulator.handleEvent(callData, model.openGLRenderWindow);

      let pt1 = [0, 0, 0];
      let pt2 = [0, 0, 0];
      if (model.hasFocus && model.widgetState.getHandleList().length === 1) {
        pt1 = model.widgetState.getHandleList()[0].getOrigin();
        pt2 = model.widgetState.getMoveHandle().getOrigin();
        publicAPI.updateLabel([pt1[0], pt2[0], pt1[1], pt2[1], pt1[2], pt2[2]]);
      } else if (model.widgetState.getHandleList().length === 2) {
        pt1 = model.widgetState.getHandleList()[0].getOrigin();
        pt2 = model.widgetState.getHandleList()[1].getOrigin();
        publicAPI.updateLabel([pt1[0], pt2[0], pt1[1], pt2[1], pt1[2], pt2[2]]);
      }

      if (model.activeState === model.widgetState.getMoveHandle() || isDragging) {
        model.activeState.setOrigin(worldCoords);
        publicAPI.invokeInteractionEvent();
        return macro.VOID;
      }
    }

    if (model.hasFocus) {
      model.widgetManager.disablePicking();
    }

    return macro.VOID;
  };

  // --------------------------------------------------------------------------
  // Left release: Finish drag / Create new handle
  // --------------------------------------------------------------------------

  publicAPI.handleLeftButtonRelease = () => {
    if (isDragging && model.pickable) {
      model.openGLRenderWindow.setCursor('pointer');
      model.widgetState.deactivate();
      model.interactor.cancelAnimation(publicAPI);
      publicAPI.invokeEndInteractionEvent();
    } else if (model.activeState !== model.widgetState.getMoveHandle()) {
      model.widgetState.deactivate();
    }

    if (
      (model.hasFocus && !model.activeState) ||
      (model.activeState && !model.activeState.getActive())
    ) {
      publicAPI.invokeEndInteractionEvent();
      model.widgetManager.enablePicking();
      model.interactor.render();
    }

    isDragging = false;

    if (model.isCreated) {
      return macro.VOID;
    }

    if (!model.activeState || !model.activeState.getActive() || !model.pickable) {
      return macro.VOID;
    }

    if (model.widgetState.getHandleList().length === MAX_POINTS && model.isCreated === false) {
      model.isCreated = true;
      if (model.activeState !== model.widgetState.getMoveHandle()) {
        model.interactor.requestAnimation(publicAPI);
        model.activeState.deactivate();
        model.widgetState.removeHandle(model.activeState);
        model.activeState = null;
        model.interactor.cancelAnimation(publicAPI);
      }
      publicAPI.invokeStartInteractionEvent();
      publicAPI.invokeInteractionEvent();
      publicAPI.invokeEndInteractionEvent();
      eventCBs.forEach((eventCB) => {
        eventCB({
          eventType: EventType.MouseDown,
          actionType: model.actionType,
          actionState: ActionState.Finish,
        });
      });
      return macro.EVENT_ABORT;
    }

    return macro.VOID;
  };

  publicAPI.handleRightButtonRelease = () => {
    if (model.activeState) {
      if (model.widgetState.getHandleList().length === 1) {
        model.label.setContainer(null);
        model.label = null;

        eventCBs.forEach((eventCB) => {
          eventCB({
            eventType: EventType.MouseDown,
            actionType: model.actionType,
            actionState: ActionState.Cancel,
          });
        });
      } else if (model.widgetState.getHandleList().length === 0) {
        eventCBs.forEach((eventCB) => {
          eventCB({
            eventType: EventType.MouseDown,
            actionType: model.actionType,
            actionState: ActionState.Finish,
          });
        });
      }
      return macro.EVENT_ABORT;
    }

    return macro.VOID;
  };

  // --------------------------------------------------------------------------
  // Focus API - modeHandle follow mouse when widget has focus
  // --------------------------------------------------------------------------

  publicAPI.grabFocus = () => {
    if (!model.hasFocus) {
      if (!model.label) {
        model.label = vtkLabelRepresentation.newInstance();
      }
      model.label.setRenderer(model.renderer);
      model.label.buildRepresentation();
      model.renderer.addViewProp(model.label);
      model.label.setContainer(model.interactor.getContainer());
      model.label.setTextAlign(TextAlign.CENTER);
      model.label.setVerticalAlign(VerticalAlign.CENTER);

      model.activeState = model.widgetState.getMoveHandle();
      model.activeState.activate();
      model.activeState.setVisible(false);
      model.interactor.requestAnimation(publicAPI);
      publicAPI.invokeStartInteractionEvent();
    }
    model.hasFocus = true;
  };

  // --------------------------------------------------------------------------

  publicAPI.loseFocus = () => {
    console.log('lose focus distance widget');
    if (model.hasFocus) {
      model.interactor.cancelAnimation(publicAPI);
      publicAPI.invokeEndInteractionEvent();
    }

    model.widgetState.deactivate();
    model.widgetState.getMoveHandle().deactivate();
    model.widgetState.getMoveHandle().setVisible(false);
    model.activeState = null;
    model.hasFocus = false;
    model.widgetManager.enablePicking();
    model.interactor.render();
  };

  // eslint-disable-next-line consistent-return
  publicAPI.updateLabel = (bounds) => {
    if (model.label) {
      const point1 = model.openGLRenderWindow.worldToDisplay(
        bounds[0],
        bounds[2],
        bounds[4],
        model.renderer
      );
      const point2 = model.openGLRenderWindow.worldToDisplay(
        bounds[1],
        bounds[3],
        bounds[5],
        model.renderer
      );
      const screenBounds = [point1[0], point2[0], point1[1], point2[1], point1[2], point2[2]];

      const center = vtkBoundingBox.getCenter(screenBounds);
      model.label.setDisplayPosition([center[0] - 30, center[1] + 20, center[2]]); // TODO : need to be check.

      const handles = model.widgetState.getHandleList();
      if (handles.length === 0) {
        return 0;
      }
      const pt1 = handles[0];
      const pt2 = handles.length === 2 ? handles[1] : model.widgetState.getMoveHandle();

      const distance = Math.sqrt(distance2BetweenPoints(pt1.getOrigin(), pt2.getOrigin()));

      model.label.setLabelText(`${distance.toFixed(1)}mm`);
    }
  };

  publicAPI.setEventCB = (eventCB) => {
    eventCBs.push(eventCB);
  };
}
