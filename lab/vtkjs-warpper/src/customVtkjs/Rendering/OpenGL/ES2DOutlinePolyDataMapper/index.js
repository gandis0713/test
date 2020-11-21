import macro from 'vtk.js/Sources/macro';
import vtkOpenGLPolyDataMapper from 'vtk.js/Sources/Rendering/OpenGL/PolyDataMapper';
import vtkProperty from 'vtk.js/Sources/Rendering/Core/Property';

const { Shading } = vtkProperty;

// ----------------------------------------------------------------------------
// vtkES2DOutlineOpenGLPolyDataMapper methods
// ----------------------------------------------------------------------------

function vtkES2DOutlineOpenGLPolyDataMapper(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkES2DOutlineOpenGLPolyDataMapper');
  const superClass = { ...publicAPI };

  publicAPI.opaquePass = (prepass, renderPass) => {
    if (renderPass.getDrawOutline()) {
      return;
    }
    model.drawOutline = false;
    superClass.opaquePass(prepass, renderPass);
  };

  publicAPI.opaqueOutlinePass = (prepass, renderPass) => {
    if (renderPass.getDrawOutline() === false) {
      return;
    }
    model.drawOutline = true;
    superClass.opaquePass(prepass, renderPass);
  };

  publicAPI.getNeedToRebuildShaders = (cellBO, ren, actor) => {
    let lightComplexity = 0;
    let numberOfLights = 0;

    const primType = cellBO.getPrimitiveType();
    const poly = model.currentInput;

    // different algo from C++ as of 5/2019
    let needLighting = false;
    const pointNormals = poly.getPointData().getNormals();
    const cellNormals = poly.getCellData().getNormals();
    const flat = actor.getProperty().getInterpolation() === Shading.FLAT;
    const representation = actor.getProperty().getRepresentation();
    const mode = publicAPI.getOpenGLMode(representation, primType);
    // 1) all surfaces need lighting
    if (mode === model.context.TRIANGLES) {
      needLighting = true;
      // 2) all cell normals without point normals need lighting
    } else if (cellNormals && !pointNormals) {
      needLighting = true;
      // 3) Phong + pointNormals need lighting
    } else if (!flat && pointNormals) {
      needLighting = true;
      // 4) Phong Lines need lighting
    } else if (!flat && mode === model.context.LINES) {
      needLighting = true;
    }
    // 5) everything else is unlit

    // do we need lighting?
    if (actor.getProperty().getLighting() && needLighting && !model.drawOutline) {
      // consider the lighting complexity to determine which case applies
      // simple headlight, Light Kit, the whole feature set of VTK
      lightComplexity = 0;
      const lights = ren.getLightsByReference();
      for (let index = 0; index < lights.length; ++index) {
        const light = lights[index];
        const status = light.getSwitch();
        if (status > 0) {
          numberOfLights++;
          if (lightComplexity === 0) {
            lightComplexity = 1;
          }
        }

        if (
          lightComplexity === 1 &&
          (numberOfLights > 1 || light.getIntensity() !== 1.0 || !light.lightTypeIsHeadLight())
        ) {
          lightComplexity = 2;
        }
        if (lightComplexity < 3 && light.getPositional()) {
          lightComplexity = 3;
        }
      }
    }

    let needRebuild = false;
    const lastLightComplexity = model.lastBoundBO.getReferenceByName('lastLightComplexity');
    const lastLightCount = model.lastBoundBO.getReferenceByName('lastLightCount');
    if (lastLightComplexity !== lightComplexity || lastLightCount !== numberOfLights) {
      model.lastBoundBO.set({ lastLightComplexity: lightComplexity }, true);
      model.lastBoundBO.set({ lastLightCount: numberOfLights }, true);
      needRebuild = true;
    }

    // has something changed that would require us to recreate the shader?
    // candidates are
    // property modified (representation interpolation and lighting)
    // input modified
    // light complexity changed
    if (
      model.lastHaveSeenDepthRequest !== model.haveSeenDepthRequest ||
      cellBO.getProgram() === 0 ||
      cellBO.getShaderSourceTime().getMTime() < publicAPI.getMTime() ||
      cellBO.getShaderSourceTime().getMTime() < actor.getMTime() ||
      cellBO.getShaderSourceTime().getMTime() < model.renderable.getMTime() ||
      cellBO.getShaderSourceTime().getMTime() < model.currentInput.getMTime() ||
      needRebuild
    ) {
      model.lastHaveSeenDepthRequest = model.haveSeenDepthRequest;
      return true;
    }

    return false;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  drawOutline: false,
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkOpenGLPolyDataMapper.extend(publicAPI, model, initialValues);

  // Object methods
  vtkES2DOutlineOpenGLPolyDataMapper(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkES2DOutlineOpenGLPolyDataMapper');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
