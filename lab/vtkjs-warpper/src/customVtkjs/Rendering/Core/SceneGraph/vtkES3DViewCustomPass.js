import macro from 'vtk.js/Sources/macro';
import vtkESCustomPass from './vtkESCustomPass';

// ----------------------------------------------------------------------------

function vtkES3DViewCustomPass(publicAPI, model) {
  model.classHierarchy.push('vtkES3DViewCustomPass');
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  vtkESCustomPass.extend(publicAPI, model, initialValues);

  // Object methods
  vtkES3DViewCustomPass(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkES3DViewCustomPass');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
