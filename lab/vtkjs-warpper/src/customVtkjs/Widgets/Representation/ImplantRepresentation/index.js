import macro from 'vtk.js/Sources/macro';
import vtkHandleRepresentation from 'vtk.js/Sources/Widgets/Representations/HandleRepresentation';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkPixelSpaceCallbackMapper from 'vtk.js/Sources/Rendering/Core/PixelSpaceCallbackMapper';
import { vec3, mat4 } from 'gl-matrix';
import vtkES2DOulintMapper from '../../../Rendering/Core/ES2DOutlineMapper';
import vtkES2DOulintActor from '../../../Rendering/Core/ES2DOutlineActor';

// ----------------------------------------------------------------------------
// vtkImplantRepresentation methods
// ----------------------------------------------------------------------------

function vtkImplantRepresentation(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkImplantRepresentation');

  model.displayMapper = vtkPixelSpaceCallbackMapper.newInstance();
  model.displayActor = vtkActor.newInstance();
  model.displayActor.setMapper(model.displayMapper);
  model.displayMapper.setInputConnection(publicAPI.getOutputPort());
  publicAPI.addActor(model.displayActor);
  model.alwaysVisibleActors = [model.displayActor];
  // --------------------------------------------------------------------------
  // Generic rendering pipeline
  // --------------------------------------------------------------------------

  model.mapper = vtkES2DOulintMapper.newInstance();
  model.actor = vtkES2DOulintActor.newInstance();

  model.mapper.setInputConnection(publicAPI.getOutputPort(), 0);
  model.actor.setMapper(model.mapper);
  model.actor.setUserMatrix([1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1]);

  publicAPI.addActor(model.actor);

  // --------------------------------------------------------------------------

  // --------------------------------------------------------------------------

  publicAPI.setDisplayCallback = (callback) =>
    model.representations[0].setDisplayCallback(callback);

  // --------------------------------------------------------------------------

  // eslint-disable-next-line no-return-assign
  publicAPI.setPolyData = (polyData) => {
    model.internalPolyData = polyData;
    model.mapper.addInputConnection(model.internalPolyData, 1);
  };
  publicAPI.setPosition = (position) => {
    // model.actor.setPosition(position);
  };

  publicAPI.setOrientation = (x, y, z) => {
    // model.actor.setOrientation(x, y, z);
  };
  // publicAPI.setUserMatrix = (matrix) => model.actor.setUserMatrix(matrix);

  publicAPI.requestData = (inData, outData) => {
    // console.log('inData1 : ', inData);
    if (!model.internalPolyData) {
      return;
    }

    const list = publicAPI.getRepresentationStates(inData[0]);
    if (list.length !== 1) {
      return;
    }

    const state = list[0];
    const opacity = state.getVisible() ? 1 : 0;
    model.actor.getProperty().setOpacity(opacity);

    const oriInvMat = [1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1];
    const oriMat = [1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1];
    const position = [0, 0, 0];
    vec3.transformMat4(position, state.getOrigin(), oriInvMat);
    model.actor.setPosition(position);

    const right = state.getState().right;
    const up = state.getState().up;
    const direction = state.getState().direction;
    const orientation = publicAPI.getOrientationAngle(up, right, direction);
    // vec3.transformMat4(orientation, orientation, oriMat);
    model.actor.setOrientation(orientation[0], orientation[1], orientation[2]);
    // model.actor.setOrientation(0, 90, 0);
    // model.actor.addOrientation(0, -45, 0);
    console.log('orientation : ', orientation);

    model.internalPolyData.modified();
    outData[0] = model.internalPolyData;
  };

  // publicAPI.getSelectedState = (prop, compositeID) => model.state;
  publicAPI.getSelectedState = (prop, compositeID) => {
    const representationStates = publicAPI.getRepresentationStates();
    console.log('prop : ', prop);
    console.log('compositeID : ', compositeID);
    console.log('representationStates.length : ', representationStates.length);
    return representationStates[representationStates.length - 1];
    // const representationStates = publicAPI.getRepresentationStates();
    // console.log('prop : ', prop);
    // console.log('compositeID : ', compositeID);
    // console.log('representationStates.length : ', representationStates.length);
    // if (compositeID < representationStates.length) {
    //   return representationStates[compositeID];
    // }
    // return null;
  };

  publicAPI.getOrientationAngle = (up, right, direction) => {
    // https://stackoverflow.com/questions/15022630/how-to-calculate-the-angle-from-rotation-matrix
    console.log('up1 : ', up);
    console.log('right1 : ', right);
    console.log('direction1 : ', direction);
    const x = (Math.atan2(up[2], direction[2]) * 180) / Math.PI;
    // const x = (Math.atan2(direction[1], direction[2]) * 180) / Math.PI;
    const y =
      (Math.atan2(-right[2], Math.sqrt(up[2] * up[2] + direction[2] * direction[2])) * 180) /
      Math.PI;
    // const y =
    // (Math.atan2(
    // -direction[0],
    // Math.sqrt(direction[1] * direction[1] + direction[2] * direction[2])
    // ) *
    // 180) /
    // Math.PI;
    const z = (Math.atan2(right[1], right[0]) * 180) / Math.PI;
    // const z = (Math.atan2(up[0], right[0]) * 180) / Math.PI;

    return [x, y, z];
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  vtkHandleRepresentation.extend(publicAPI, model, initialValues);

  // Object specific methods
  vtkImplantRepresentation(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkImplantRepresentation');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
