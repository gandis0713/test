import * as macro from 'vtk.js/Sources/macro';
import vtkRenderer from '../Renderer';

// ----------------------------------------------------------------------------
// vtkESRenderer methods
// ----------------------------------------------------------------------------

function vtkESRenderer(publicAPI, model) {
  // Set our className
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  viewType: ''
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  vtkRenderer.extend(publicAPI, model, initialValues);

  macro.setGet(publicAPI, model, ['viewType']);

  // Object methods
  vtkESRenderer(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkESRenderer');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
