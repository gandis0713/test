import macro from 'vtk.js/Sources/macro';
import { ActionState } from '../../../../common/types';

export default function widgetBehavior(publicAPI, model) {
  model.classHierarchy.push('vtkDistanceWidgetProp');
  const eventCBs = [];
  let isDragging = null;

  const implantRepresentationName = 'vtkImplantRepresentation';

  model.representations.forEach((representation) => {
    if (representation.getClassName() === implantRepresentationName)
      representation.setPolyData(model.polyData);
  });

  publicAPI.setImplantPosition = (position) => {
    model.representations.forEach((representation) => {
      // if (representation.getClassName() === implantRepresentationName)
      // representation.setPosition(position);
    });
  };

  publicAPI.setImplantUserMatrixe = (matrix) => {
    model.representations.forEach((representation) => {
      // if (representation.getClassName() === implantRepresentationName)
      // representation.setUserMatrixe(matrix);
    });
  };

  // --------------------------------------------------------------------------
  // Display 2D
  // --------------------------------------------------------------------------

  publicAPI.setDisplayCallback = (callback) =>
    model.representations[0].setDisplayCallback(callback);

  // --------------------------------------------------------------------------
  // Left press: Select handle to drag
  // --------------------------------------------------------------------------

  publicAPI.handleLeftButtonPress = (callData) => {
    if (!model.pickable || !model.activeState || !model.activeState.getActive()) {
      return macro.VOID;
    }

    console.log('test1');
    isDragging = true;
    model.openGLRenderWindow.setCursor('grabbing');
    model.interactor.requestAnimation(publicAPI);

    publicAPI.invokeStartInteractionEvent();

    return macro.EVENT_ABORT;
  };

  publicAPI.handleLeftButtonRelease = () => {
    if (!model.pickable || !model.activeState || !model.activeState.getActive()) {
      return macro.VOID;
    }

    console.log('test 2');
    if (isDragging && model.pickable) {
      console.log('test 3');
      model.openGLRenderWindow.setCursor('pointer');
      model.widgetState.deactivate();
      model.interactor.cancelAnimation(publicAPI);
      publicAPI.invokeEndInteractionEvent();
    }

    isDragging = false;

    return macro.VOID;
  };

  // --------------------------------------------------------------------------
  // Mouse move: Drag selected handle / Handle follow the mouse
  // --------------------------------------------------------------------------

  publicAPI.handleMouseMove = (callData) => {
    if (model.pickable && model.manipulator && model.activeState && model.activeState.getActive()) {
      const worldCoords = model.manipulator.handleEvent(callData, model.openGLRenderWindow);
      if (isDragging) {
        console.log('test 4');
        model.activeState.setOrigin(worldCoords);
        publicAPI.invokeInteractionEvent();
        return macro.EVENT_ABORT;
      }
    }

    if (model.hasFocus) {
      model.widgetManager.disablePicking();
    }

    return macro.VOID;
  };

  publicAPI.handleRightButtonRelease = () => {
    // context menu
  };

  // --------------------------------------------------------------------------
  // Focus API - modeHandle follow mouse when widget has focus
  // --------------------------------------------------------------------------

  publicAPI.grabFocus = () => {
    if (!model.hasFocus) {
      model.interactor.requestAnimation(publicAPI);
      publicAPI.invokeStartInteractionEvent();
    }
    model.widgetState.activate();
    model.activeState = model.widgetState.getHandle();
    model.activeState.activate();

    model.hasFocus = true;
  };

  // // --------------------------------------------------------------------------

  publicAPI.loseFocus = () => {
    if (model.hasFocus) {
      model.interactor.cancelAnimation(publicAPI);
      publicAPI.invokeEndInteractionEvent();
    }
    model.widgetState.deactivate();
    model.activeState = null;
    model.hasFocus = false;
    model.widgetManager.enablePicking();
    model.interactor.render();
  };

  publicAPI.setOrientation = (up, right, direction) => {
    model.widgetState.getHandle().setUp([up[0], up[1], up[2]]);
    model.widgetState.getHandle().setRight([right[0], right[1], right[2]]);
    model.widgetState.getHandle().setDirection([direction[0], direction[1], direction[2]]);
    model.interactor.render();
  };

  publicAPI.setOrigin = (origin) => {
    model.widgetState.getHandle().setOrigin(origin);
    model.interactor.render();
  };

  publicAPI.setEventCB = (eventCB) => {
    eventCBs.push(eventCB);
  };
}
