import macro from 'vtk.js/Sources/macro';
import vtkInteractorStyleManipulator from 'vtk.js/Sources/Interaction/Style/InteractorStyleManipulator';
import { vec3 } from 'gl-matrix';

// ----------------------------------------------------------------------------
// vtkInteractorStyleSection methods
// ----------------------------------------------------------------------------

function vtkInteractorStyleSection(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkInteractorStyleSection');

  // Public API methods
  publicAPI.superHandleMouseMove = publicAPI.handleMouseMove;
  publicAPI.handleMouseMove = (callData) => {
    // publicAPI.superHandleMouseMove(callData);
  };

  //----------------------------------------------------------------------------
  publicAPI.superHandleLeftButtonPress = publicAPI.handleLeftButtonPress;
  publicAPI.handleLeftButtonPress = (callData) => {
    // publicAPI.superHandleLeftButtonPress(callData);
  };

  //--------------------------------------------------------------------------
  publicAPI.superHandleLeftButtonRelease = publicAPI.handleLeftButtonRelease;
  publicAPI.handleLeftButtonRelease = () => {
    // publicAPI.superHandleLeftButtonRelease();
  };

  publicAPI.setThickness = (thickness) => {
    model.thickness = thickness;
    console.log('setThickness :', thickness);

    // Update the camera clipping range if the slab
    // thickness property is changed
    const renderer = model.interactor.getCurrentRenderer();
    const camera = renderer.getActiveCamera();
    camera.setThicknessFromFocalPoint(thickness);
  };

  publicAPI.setOrientation = (focalPoint, normalForward, normalRight) => {
    if (normalRight[0] === 0 && normalRight[1] === 0 && normalRight[2] === 0) {
      return;
    }

    if (normalForward[0] === 0 && normalForward[1] === 0 && normalForward[2] === 0) {
      return;
    }

    if (
      normalForward[0] === normalRight[0] &&
      normalForward[1] === normalRight[1] &&
      normalForward[2] === normalRight[2]
    ) {
      return;
    }

    const renderer = model.interactor.getCurrentRenderer();
    const camera = renderer.getActiveCamera();
    const normalUp = [];
    vec3.cross(normalUp, normalRight, normalForward);
    vec3.normalize(normalUp, normalUp);
    camera.setViewUp(...normalUp);

    const dist = camera.getDistance();

    const position = [
      focalPoint[0] - normalForward[0] * dist,
      focalPoint[1] - normalForward[1] * dist,
      focalPoint[2] - normalForward[2] * dist,
    ];

    camera.setPosition(...position);
    camera.setFocalPoint(...focalPoint);
  };

  publicAPI.setFocalPoint = (point) => {
    const renderer = model.interactor.getCurrentRenderer();
    const camera = renderer.getActiveCamera();

    const preFocalPoint = camera.getFocalPoint();
    const prePosition = camera.getPosition();
    const dist = camera.getDistance();

    const normalForward = vec3.create();
    vec3.subtract(normalForward, preFocalPoint, prePosition);
    vec3.normalize(normalForward, normalForward);

    const position = [
      point[0] - normalForward[0] * dist,
      point[1] - normalForward[1] * dist,
      point[2] - normalForward[2] * dist,
    ];

    camera.setPosition(...position);
    camera.setFocalPoint(...point);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  thickness: 1.0,
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkInteractorStyleManipulator.extend(publicAPI, model, initialValues);

  macro.get(publicAPI, model, ['thickness']);
  // For more macro methods, see "Sources/macro.js"

  // Object specific methods
  vtkInteractorStyleSection(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkInteractorStyleSection');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
