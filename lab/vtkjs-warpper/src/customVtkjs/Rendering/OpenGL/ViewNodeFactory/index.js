import macro from 'vtk.js/Sources/macro';
import vtkOpenGLViewNodeFactory from 'vtk.js/Sources/Rendering/OpenGL/ViewNodeFactory';
import vtkES2DOpenGLVolumeMapper from '../ES2DVolumeMapper';
import vtkES2DPanOpenGLVolumeMapper from '../ES2DPanVolumeMapper';
import vtkES2DSectionOpenGLVolumeMapper from '../ES2DSectionVolumeMapper';
import vtkES3DOpenGLVolumeMapper from '../ES3DVolumeMapper';
import vtkCustomOpenGLVolume from '../Volume';
import vtkES2DOutlineOpenGLActor from '../ES2DOutlineActor';
import vtkES2DOutlineOpenGLPolyDataMapper from '../ES2DOutlinePolyDataMapper';

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
  publicAPI.registerOverride('vtkESVolume', vtkCustomOpenGLVolume.newInstance);
  publicAPI.registerOverride('vtkES2DVolumeMapper', vtkES2DOpenGLVolumeMapper.newInstance);
  publicAPI.registerOverride(
    'vtkES2DSectionVolumeMapper',
    vtkES2DSectionOpenGLVolumeMapper.newInstance
  );
  publicAPI.registerOverride('vtkES2DPanVolumeMapper', vtkES2DPanOpenGLVolumeMapper.newInstance);
  publicAPI.registerOverride('vtkES3DVolumeMapper', vtkES3DOpenGLVolumeMapper.newInstance);
  publicAPI.registerOverride(
    'vtkES2DOutlineMapper',
    vtkES2DOutlineOpenGLPolyDataMapper.newInstance
  );

  // actor
  publicAPI.registerOverride('vtkES2DOutlineActor', vtkES2DOutlineOpenGLActor.newInstance);

  // Object methods
  vtkCustomOpenGLViewNodeFactory(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkCustomOpenGLViewNodeFactory');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
