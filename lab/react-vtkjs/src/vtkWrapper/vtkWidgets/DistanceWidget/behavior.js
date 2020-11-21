import macro from 'vtk.js/Sources/macro';
import vtkLabelRepresentation from 'vtk.js/Sources/Interaction/Widgets/LabelRepresentation';

const MAX_POINTS = 2;

export default function widgetBehavior(publicAPI, model) {
  model.classHierarchy.push('vtkDistanceWidgetProp');
  let isDragging = null;

  // --------------------------------------------------------------------------
  // Display 2D
  // --------------------------------------------------------------------------

  publicAPI.setDisplayCallback = callback => model.representations[0].setDisplayCallback(callback);

  // --------------------------------------------------------------------------
  // Interactor events
  // --------------------------------------------------------------------------

  function ignoreKey(e) {
    return e.altKey || e.controlKey || e.shiftKey;
  }

  // --------------------------------------------------------------------------
  // Left press: Select handle to drag
  // --------------------------------------------------------------------------

  publicAPI.handleLeftButtonPress = e => {
    if (!model.activeState || !model.activeState.getActive() || !model.pickable || ignoreKey(e)) {
      return macro.VOID;
    }

    if (
      model.activeState === model.widgetState.getMoveHandle() &&
      model.widgetState.getHandleList().length < MAX_POINTS
    ) {
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

  publicAPI.handleMouseMove = callData => {
    if (model.hasFocus && model.widgetState.getHandleList().length === MAX_POINTS) {
      publicAPI.loseFocus();
      return macro.VOID;
    }

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

      if (model.hasFocus && model.widgetState.getHandleList().length === 1) {
        const pt1 = model.widgetState.getHandleList()[0].getOrigin();
        const pt2 = model.widgetState.getMoveHandle().getOrigin();
        publicAPI.setBounds([pt1[0], pt2[0], pt1[1], pt2[1], pt1[2], pt2[2]]);
      } else if (model.widgetState.getHandleList().length === 2) {
        const pt1 = model.widgetState.getHandleList()[0].getOrigin();
        const pt2 = model.widgetState.getHandleList()[1].getOrigin();
        publicAPI.setBounds([pt1[0], pt2[0], pt1[1], pt2[1], pt1[2], pt2[2]]);
      }

      if (model.activeState === model.widgetState.getMoveHandle() || isDragging) {
        model.activeState.setOrigin(worldCoords);
        publicAPI.invokeInteractionEvent();
        return macro.EVENT_ABORT;
      }
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
  };

  // --------------------------------------------------------------------------
  // Focus API - modeHandle follow mouse when widget has focus
  // --------------------------------------------------------------------------

  publicAPI.grabFocus = () => {
    if (!model.hasFocus && model.widgetState.getHandleList().length < MAX_POINTS) {
      if (!model.label) {
        model.label = vtkLabelRepresentation.newInstance();
      }
      model.label.setRenderer(model.renderer);
      model.label.buildRepresentation();
      model.renderer.addViewProp(model.label);
      model.label.setContainer(model.interactor.getContainer());

      model.activeState = model.widgetState.getMoveHandle();
      model.activeState.activate();
      model.activeState.setVisible(true);
      model.interactor.requestAnimation(publicAPI);
      publicAPI.invokeStartInteractionEvent();
    }
    model.hasFocus = true;
  };

  // --------------------------------------------------------------------------

  publicAPI.loseFocus = () => {
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

  publicAPI.setBounds = bounds => {
    if (model.label && model.labelTextCallback) {
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

      model.labelTextCallback(bounds, screenBounds, model.label);
    }
  };

  publicAPI.setLabelTextCallback = callback => {
    model.labelTextCallback = callback;
  };
}
