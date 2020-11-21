import macro from 'vtk.js/Sources/macro';
import vtkPointPicker from 'vtk.js/Sources/Rendering/Core/PointPicker';
import * as vtkMath from 'vtk.js/Sources/Common/Core/Math';

import vtkLabelRepresentation from '../Representation/LabelRepresentation';

const MAX_POINTS = 3;

function makeBoundsFrom3Points(point1, point2, point3) {
  return [
    Math.min(Math.min(point1[0], point2[0]), point3[0]),
    Math.max(Math.max(point1[0], point2[0]), point3[0]),
    Math.min(Math.min(point1[1], point2[1]), point3[1]),
    Math.max(Math.max(point1[1], point2[1]), point3[1]),
    Math.min(Math.min(point1[2], point2[2]), point3[2]),
    Math.max(Math.max(point1[2], point2[2]), point3[2])
  ];
}

export default function widgetBehavior(publicAPI, model) {
  model.classHierarchy.push('vtkAngleWidgetProp');
  let isDragging = null;

  const picker = vtkPointPicker.newInstance();
  picker.setPickFromList(1);

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

    picker.initializePickList();
    picker.setPickList(publicAPI.getNestedProps());

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

      const handles = model.widgetState.getHandleList();
      if (handles.length > 1) {
        const point1 = handles[0].getOrigin();
        const point2 = handles[1].getOrigin();
        const point3 = (handles.length === 3
          ? handles[2]
          : model.widgetState.getMoveHandle()
        ).getOrigin();
        const bound = makeBoundsFrom3Points(point1, point2, point3);
        console.log(`boud${bound}`);
        publicAPI.setBounds(bound);
      }

      if (model.activeState === model.widgetState.getMoveHandle() || isDragging) {
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

    // Don't make any more points
    if (model.widgetState.getHandleList().length === MAX_POINTS) {
      publicAPI.loseFocus();
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
      // const point1 = model.openGLRenderWindow.worldToDisplay(
      //   bounds[0],
      //   bounds[2],
      //   bounds[4],
      //   model.renderer
      // );
      // const point2 = model.openGLRenderWindow.worldToDisplay(
      //   bounds[1],
      //   bounds[3],
      //   bounds[5],
      //   model.renderer
      // );
      // const screenBounds = [point1[0], point2[0], point1[1], point2[1], point1[2], point2[2]];
      const vecCenter = [1, 1, 1];

      const handles = model.widgetState.getHandleList();
      if (handles.length > 1) {
        const pt1 = handles[0].getOrigin();
        const pt2 = handles[1].getOrigin();
        const pt3 = (handles.length === 3
          ? handles[2]
          : model.widgetState.getMoveHandle()
        ).getOrigin();
        const point1Screen = model.openGLRenderWindow.worldToDisplay(
          pt1[0],
          pt1[1],
          pt1[2],
          model.renderer
        );
        const point2Screen = model.openGLRenderWindow.worldToDisplay(
          pt2[0],
          pt2[1],
          pt2[2],
          model.renderer
        );
        const point3Screen = model.openGLRenderWindow.worldToDisplay(
          pt3[0],
          pt3[1],
          pt3[2],
          model.renderer
        );

        const vec1 = [0, 0, 0];
        const vec2 = [0, 0, 0];
        vtkMath.subtract(point1Screen, point2Screen, vec1);
        vtkMath.subtract(point3Screen, point2Screen, vec2);
        const vec2Norm = vtkMath.norm(vec2);
        if (vec2Norm > 0) {
          vtkMath.normalize(vec1);
          vtkMath.normalize(vec2);

          vtkMath.add(vec1, vec2, vecCenter);
          vtkMath.normalize(vecCenter);
          vtkMath.multiplyScalar(vecCenter, -1);
        }
      }

      model.labelTextCallback(publicAPI.getCenterPointScreenPos(), vecCenter, model.label);
    }
  };

  publicAPI.getCenterPointScreenPos = () => {
    const handles = model.widgetState.getHandleList();
    if (handles.length < 2) {
      return null;
    }

    const pt2 = handles[1].getOrigin();

    const point2 = model.openGLRenderWindow.worldToDisplay(pt2[0], pt2[1], pt2[2], model.renderer);
    return point2;
  };

  publicAPI.setLabelTextCallback = callback => {
    model.labelTextCallback = callback;
  };
}
