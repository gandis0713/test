import macro from 'vtk.js/Sources/macro';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';

// ----------------------------------------------------------------------------
// vtkES2DPanVolumeMapper methods
// ----------------------------------------------------------------------------

function vtkES2DPanVolumeMapper(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkES2DPanVolumeMapper');
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

// ----------------------------------------------------------------------------
// TODO: what values to use for averageIPScalarRange to get GLSL to use max / min values like [-Math.inf, Math.inf]?
const DEFAULT_VALUES = {
  opacity: 1.0,
  brightness: 0.0,
  contrast: 0.0,
  panoCurveData: null,
  panoCurveRightNormal: null,
  panoCurveLength: 0.0,
  panoCurveHeight: 0.0
};
export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  vtkVolumeMapper.extend(publicAPI, model, initialValues);

  macro.setGet(publicAPI, model, [
    'opacity',
    'brightness',
    'contrast',
    'panoCurveData',
    'panoCurveRightNormal',
    'panoCurveLength',
    'panoCurveHeight'
  ]);

  // Object methods
  vtkES2DPanVolumeMapper(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkES2DPanVolumeMapper');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
