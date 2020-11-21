/* eslint-disable import/no-named-as-default-member */
import macro from 'vtk.js/Sources/macro';
// eslint-disable-next-line max-len
import vtkOpenGLViewNodeFactory from 'vtk.js/Sources/Rendering/OpenGL/ViewNodeFactory';
import vtkOpenGLRenderer from '../Renderer';
import vtkES2DOpenGLVolumeMapper from '../ES2DVolumeMapper';
import vtkES2DPanOpenGLVolumeMapper from '../ES2DPanVolumeMapper';
import vtkES2DSectionOpenGLVolumeMapper from '../ES2DSectionVolumeMapper';
import vtkES3DOpenGLVolumeMapper from '../ES3DVolumeMapper';
import vtkCustomOpenGLVolume from '../Volume';

// ----------------------------------------------------------------------------
// vtkOpenGLViewNodeFactory methods
// ----------------------------------------------------------------------------

function vtkCustomOpenGLViewNodeFactory(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkCustomOpenGLViewNodeFactory');
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkOpenGLViewNodeFactory.extend(publicAPI, model, initialValues);

  // Initialization
  publicAPI.registerOverride('vtkCustomVolume', vtkCustomOpenGLVolume.newInstance);
  publicAPI.registerOverride('vtkES2DVolumeMapper', vtkES2DOpenGLVolumeMapper.newInstance);
  publicAPI.registerOverride(
    'vtkES2DSectionVolumeMapper',
    vtkES2DSectionOpenGLVolumeMapper.newInstance
  );
  publicAPI.registerOverride('vtkES2DPanVolumeMapper', vtkES2DPanOpenGLVolumeMapper.newInstance);
  publicAPI.registerOverride('vtkES3DVolumeMapper', vtkES3DOpenGLVolumeMapper.newInstance);

  // Object methods
  vtkCustomOpenGLViewNodeFactory(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkCustomOpenGLViewNodeFactory');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
