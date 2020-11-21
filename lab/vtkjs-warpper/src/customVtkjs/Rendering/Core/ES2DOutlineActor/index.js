import macro from 'vtk.js/Sources/macro';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';

// ----------------------------------------------------------------------------
// vtkES2DOutlineActor methods
// ----------------------------------------------------------------------------

function vtkES2DOutlineActor(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkES2DOutlineActor');
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkActor.extend(publicAPI, model, initialValues);

  // Object methods
  vtkES2DOutlineActor(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkES2DOutlineActor');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
