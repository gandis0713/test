import macro from 'vtk.js/Sources/macro';
import vtkOpenGLActor from 'vtk.js/Sources/Rendering/OpenGL/Actor';

// ----------------------------------------------------------------------------
// vtkES2DOutlineOpenGLActor methods
// ----------------------------------------------------------------------------

function vtkES2DOutlineOpenGLActor(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkES2DOutlineOpenGLActor');
  const superClass = { ...publicAPI };

  publicAPI.traverseOpaquePass = (renderPass) => {
    if (renderPass.getDrawOutline()) {
      return;
    }

    superClass.traverseOpaquePass(renderPass);
  };

  publicAPI.traverseOpaqueOutlinePass = (renderPass) => {
    if (renderPass.getDrawOutline() === false) {
      return;
    }
    superClass.traverseOpaquePass(renderPass);
  };

  publicAPI.opaquePass = (prepass, renderPass) => {
    if (renderPass.getDrawOutline()) {
      return;
    }

    superClass.opaquePass(prepass, renderPass);
  };

  publicAPI.opaqueOutlinePass = (prepass, renderPass) => {
    if (renderPass.getDrawOutline() === false) {
      return;
    }
    superClass.opaquePass(prepass, renderPass);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkOpenGLActor.extend(publicAPI, model, initialValues);

  // Object methods
  vtkES2DOutlineOpenGLActor(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend);

// ----------------------------------------------------------------------------

export default { newInstance, extend };
