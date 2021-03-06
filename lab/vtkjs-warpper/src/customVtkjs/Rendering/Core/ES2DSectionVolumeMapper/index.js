import macro from 'vtk.js/Sources/macro';
import * as vtkMath from 'vtk.js/Sources/Common/Core/Math';
import Constants from './Constants';

const { BlendMode } = Constants;

// ----------------------------------------------------------------------------
// vtkES2DSectionVolumeMapper methods
// ----------------------------------------------------------------------------

function vtkES2DSectionVolumeMapper(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkES2DSectionVolumeMapper');

  publicAPI.getBounds = () => {
    const input = publicAPI.getInputData();
    if (!input) {
      model.bounds = vtkMath.createUninitializedBounds();
    } else {
      if (!model.static) {
        publicAPI.update();
      }
      model.bounds = input.getBounds();
    }
    return model.bounds;
  };

  publicAPI.update = () => {
    publicAPI.getInputData();
  };

  publicAPI.setBlendModeToComposite = () => {
    publicAPI.setBlendMode(BlendMode.COMPOSITE_BLEND);
  };

  publicAPI.setBlendModeToMaximumIntensity = () => {
    publicAPI.setBlendMode(BlendMode.MAXIMUM_INTENSITY_BLEND);
  };

  publicAPI.setBlendModeToMinimumIntensity = () => {
    publicAPI.setBlendMode(BlendMode.MINIMUM_INTENSITY_BLEND);
  };

  publicAPI.setBlendModeToAverageIntensity = () => {
    publicAPI.setBlendMode(BlendMode.AVERAGE_INTENSITY_BLEND);
  };

  publicAPI.getBlendModeAsString = () => macro.enumToString(BlendMode, model.blendMode);
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

// eslint-disable-next-line max-len
// TODO: what values to use for averageIPScalarRange to get GLSL to use max / min values like [-Math.inf, Math.inf]?
const DEFAULT_VALUES = {
  bounds: [1, -1, 1, -1, 1, -1],
  sampleDistance: 1.0,
  imageSampleDistance: 1.0,
  maximumSamplesPerRay: 1000,
  autoAdjustSampleDistances: true,
  blendMode: BlendMode.COMPOSITE_BLEND,
  averageIPScalarRange: [-1000000.0, 1000000.0],
  filteringMode: 0,
  clipWidth: 90.0,
  clipHeight: 80.0,
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Build VTK API
  macro.obj(publicAPI, model);
  macro.algo(publicAPI, model, 1, 0);

  macro.setGet(publicAPI, model, [
    'sampleDistance',
    'imageSampleDistance',
    'maximumSamplesPerRay',
    'autoAdjustSampleDistances',
    'blendMode',
    'filteringMode',
    'clipWidth',
    'clipHeight',
  ]);

  macro.setGetArray(publicAPI, model, ['averageIPScalarRange'], 2);

  macro.event(publicAPI, model, 'lightingActivated');

  // Object methods
  vtkES2DSectionVolumeMapper(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkES2DSectionVolumeMapper');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
