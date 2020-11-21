/* eslint-disable max-len */
/* eslint-disable no-plusplus */
/* eslint-disable no-param-reassign */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import macro from 'vtk.js/Sources/macro';
import { vec3, mat3, mat4 } from 'gl-matrix';
import vtkOpenGLVolumeMapper from 'vtk.js/Sources/Rendering/OpenGL/VolumeMapper';

import CardinalSpline3D from '../../../../vtkCommon/DataModel/Cardinal3D';

import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';
import { VtkDataTypes } from 'vtk.js/Sources/Common/Core/DataArray/Constants';
import vtkOpenGLTexture from 'vtk.js/Sources/Rendering/OpenGL/Texture';
import { Representation } from 'vtk.js/Sources/Rendering/Core/Property/Constants';
import { Filter } from 'vtk.js/Sources/Rendering/OpenGL/Texture/Constants';

import vtkVolumeVS from '../glsl/vtkVolumeVS.glsl';
import vtkVolumeFS from '../glsl/vtkVolumeFS2DPan.glsl';

const { vtkWarningMacro } = macro;

// ----------------------------------------------------------------------------
// vtkES2DPanOpenGLVolumeMapper methods
// ----------------------------------------------------------------------------

function vtkES2DPanOpenGLVolumeMapper(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkES2DPanOpenGLVolumeMapper');

  const parentClass = Object.assign({}, publicAPI);

  publicAPI.setColorShaderParameters = cellBO => {
    const program = cellBO.getProgram();

    program.setUniformf('opacity', model.renderable.getOpacity());
    program.setUniformf('brightness', model.renderable.getBrightness());
    program.setUniformf('contrast', model.renderable.getContrast());
  };

  publicAPI.getShaderTemplate = (shaders, ren, actor) => {
    shaders.Vertex = vtkVolumeVS;
    shaders.Fragment = vtkVolumeFS;
    shaders.Geometry = '';
  };

  publicAPI.renderPieceDraw = (ren, actor) => {
    const gl = model.context;

    // render the texture
    model.curveTexture.activate();
    model.scalarTexture.activate();
    model.opacityTexture.activate();
    model.colorTexture.activate();
    model.jitterTexture.activate();

    publicAPI.updateShaders(model.tris, ren, actor);

    // First we do the triangles, update the shader, set uniforms, etc.
    // for (let i = 0; i < 11; ++i) {
    //   gl.drawArrays(gl.TRIANGLES, 66 * i, 66);
    // }
    gl.drawArrays(gl.TRIANGLES, 0, model.tris.getCABO().getElementCount());
    // console.log(
    //   'model.tris.getCABO().getElementCount()2 : ',
    //   model.tris.getCABO().getElementCount()
    // );
    model.tris.getVAO().release();

    model.curveTexture.deactivate();
    model.scalarTexture.deactivate();
    model.colorTexture.deactivate();
    model.opacityTexture.deactivate();
    model.jitterTexture.deactivate();
  };

  publicAPI.buildBufferObjects = (ren, actor) => {
    const image = model.currentInput;

    if (image === null) {
      return;
    }

    const vprop = actor.getProperty();

    if (!model.jitterTexture.getHandle()) {
      const oTable = new Uint8Array(32 * 32);
      for (let i = 0; i < 32 * 32; ++i) {
        oTable[i] = 255.0 * Math.random();
      }
      model.jitterTexture.setMinificationFilter(Filter.LINEAR);
      model.jitterTexture.setMagnificationFilter(Filter.LINEAR);
      model.jitterTexture.create2DFromRaw(32, 32, 1, VtkDataTypes.UNSIGNED_CHAR, oTable);
    }

    const numComp = image
      .getPointData()
      .getScalars()
      .getNumberOfComponents();
    const iComps = vprop.getIndependentComponents();
    const numIComps = iComps ? numComp : 1;

    // rebuild opacity tfun?
    let toString = `${vprop.getMTime()}`;
    if (model.opacityTextureString !== toString) {
      const oWidth = 1024;
      const oSize = oWidth * 2 * numIComps;
      const ofTable = new Float32Array(oSize);
      const tmpTable = new Float32Array(oWidth);

      for (let c = 0; c < numIComps; ++c) {
        const ofun = vprop.getScalarOpacity(c);
        const opacityFactor =
          model.renderable.getSampleDistance() / vprop.getScalarOpacityUnitDistance(c);

        const oRange = ofun.getRange();
        ofun.getTable(oRange[0], oRange[1], oWidth, tmpTable, 1);
        // adjust for sample distance etc
        for (let i = 0; i < oWidth; ++i) {
          ofTable[c * oWidth * 2 + i] = 1.0 - (1.0 - tmpTable[i]) ** opacityFactor;
          ofTable[c * oWidth * 2 + i + oWidth] = ofTable[c * oWidth * 2 + i];
        }
      }

      model.opacityTexture.releaseGraphicsResources(model.openGLRenderWindow);
      model.opacityTexture.setMinificationFilter(Filter.LINEAR);
      model.opacityTexture.setMagnificationFilter(Filter.LINEAR);

      // use float texture where possible because we really need the resolution
      // for this table. Errors in low values of opacity accumulate to
      // visible artifacts. High values of opacity quickly terminate without
      // artifacts.
      if (
        model.openGLRenderWindow.getWebgl2() ||
        (model.context.getExtension('OES_texture_float') &&
          model.context.getExtension('OES_texture_float_linear'))
      ) {
        model.opacityTexture.create2DFromRaw(oWidth, 2 * numIComps, 1, VtkDataTypes.FLOAT, ofTable);
      } else {
        const oTable = new Uint8Array(oSize);
        for (let i = 0; i < oSize; ++i) {
          oTable[i] = 255.0 * ofTable[i];
        }
        model.opacityTexture.create2DFromRaw(
          oWidth,
          2 * numIComps,
          1,
          VtkDataTypes.UNSIGNED_CHAR,
          oTable
        );
      }
      model.opacityTextureString = toString;
    }

    // rebuild color tfun?
    toString = `${vprop.getMTime()}`;
    if (model.colorTextureString !== toString) {
      const cWidth = 1024;
      const cSize = cWidth * 2 * numIComps * 3;
      const cTable = new Uint8Array(cSize);
      const tmpTable = new Float32Array(cWidth * 3);

      for (let c = 0; c < numIComps; ++c) {
        const cfun = vprop.getRGBTransferFunction(c);
        const cRange = cfun.getRange();
        cfun.getTable(cRange[0], cRange[1], cWidth, tmpTable, 1);
        for (let i = 0; i < cWidth * 3; ++i) {
          cTable[c * cWidth * 6 + i] = 255.0 * tmpTable[i];
          cTable[c * cWidth * 6 + i + cWidth * 3] = 255.0 * tmpTable[i];
        }
      }

      model.colorTexture.releaseGraphicsResources(model.openGLRenderWindow);
      model.colorTexture.setMinificationFilter(Filter.LINEAR);
      model.colorTexture.setMagnificationFilter(Filter.LINEAR);

      model.colorTexture.create2DFromRaw(
        cWidth,
        2 * numIComps,
        3,
        VtkDataTypes.UNSIGNED_CHAR,
        cTable
      );
      model.colorTextureString = toString;
    }

    // rebuild the scalarTexture if the data has changed
    toString = `${image.getMTime()}`;
    if (model.scalarTextureString !== toString) {
      // Build the textures
      const dims = image.getDimensions();
      model.scalarTexture.releaseGraphicsResources(model.openGLRenderWindow);
      model.scalarTexture.resetFormatAndType();
      model.scalarTexture.create3DFilterableFromRaw(
        dims[0],
        dims[1],
        dims[2],
        numComp,
        image
          .getPointData()
          .getScalars()
          .getDataType(),
        image
          .getPointData()
          .getScalars()
          .getData()
      );
      // console.log(model.scalarTexture.get());
      model.scalarTextureString = toString;
    }

    // start creating spline data by charles
    let curveRightDir = [];
    let curvePos = [];
    if (model.renderable.getPanoCurveData() !== null) {
      curvePos = model.renderable.getPanoCurveData();
      curveRightDir = model.renderable.getPanoCurveRightNormal();
    }

    // create texture data

    const curveTexture = {
      width: curvePos.length,
      height: 2
    };

    curveTexture.data = new Float32Array(curveTexture.width * curveTexture.height * 4);
    for (let i = 0; i < curveTexture.width; i++) {
      curveTexture.data[i * 4] = curvePos[i][0];
      curveTexture.data[i * 4 + 1] = curvePos[i][1];
      curveTexture.data[i * 4 + 2] = curvePos[i][2];
      curveTexture.data[i * 4 + 3] = curvePos[i][3];
    }
    for (let i = curveTexture.width; i < curveTexture.width * 2; i++) {
      curveTexture.data[i * 4] = curveRightDir[i - curveTexture.width][0];
      curveTexture.data[i * 4 + 1] = curveRightDir[i - curveTexture.width][1];
      curveTexture.data[i * 4 + 2] = curveRightDir[i - curveTexture.width][2];
      curveTexture.data[i * 4 + 3] = curveRightDir[i - curveTexture.width][3];
    }

    // model.curveTexture = cfunToString; // check re build
    model.curveTexture.releaseGraphicsResources(model.openGLRenderWindow);
    model.curveTexture.setMinificationFilter(Filter.LINEAR);
    model.curveTexture.setMagnificationFilter(Filter.LINEAR);
    model.curveTexture.create2DFromRaw(
      curveTexture.width, // width
      curveTexture.height, // height
      4, // rgba
      VtkDataTypes.FLOAT,
      curveTexture.data
    );

    // end creating spline data by charles

    if (!model.tris.getCABO().getElementCount()) {
      // build the CABO
      const ptsArray = new Float32Array(12);
      for (let i = 0; i < 4; i++) {
        ptsArray[i * 3] = (i % 2) * 2 - 1.0;
        ptsArray[i * 3 + 1] = i > 1 ? 1.0 : -1.0;
        ptsArray[i * 3 + 2] = -1.0;
      }

      const cellArray = new Uint16Array(8);
      cellArray[0] = 3;
      cellArray[1] = 0;
      cellArray[2] = 1;
      cellArray[3] = 3;
      cellArray[4] = 3;
      cellArray[5] = 0;
      cellArray[6] = 3;
      cellArray[7] = 2;

      // const dim = 12.0;
      // const ptsArray = new Float32Array(3 * dim * dim);
      // for (let i = 0; i < dim; i++) {
      //   for (let j = 0; j < dim; j++) {
      //     const offset = ((i * dim) + j) * 3;
      //     ptsArray[offset] = (2.0 * (i / (dim - 1.0))) - 1.0;
      //     ptsArray[offset + 1] = (2.0 * (j / (dim - 1.0))) - 1.0;
      //     ptsArray[offset + 2] = -1.0;
      //   }
      // }

      // const cellArray = new Uint16Array(8 * (dim - 1) * (dim - 1));
      // for (let i = 0; i < dim - 1; i++) {
      //   for (let j = 0; j < dim - 1; j++) {
      //     const offset = 8 * ((i * (dim - 1)) + j);
      //     cellArray[offset] = 3;
      //     cellArray[offset + 1] = (i * dim) + j;
      //     cellArray[offset + 2] = (i * dim) + 1 + j;
      //     cellArray[offset + 3] = ((i + 1) * dim) + 1 + j;
      //     cellArray[offset + 4] = 3;
      //     cellArray[offset + 5] = (i * dim) + j;
      //     cellArray[offset + 6] = ((i + 1) * dim) + 1 + j;
      //     cellArray[offset + 7] = ((i + 1) * dim) + j;
      //   }
      // }

      const points = vtkDataArray.newInstance({
        numberOfComponents: 3,
        values: ptsArray
      });
      points.setName('points');
      const cells = vtkDataArray.newInstance({
        numberOfComponents: 1,
        values: cellArray
      });
      model.tris.getCABO().createVBO(cells, 'polys', Representation.SURFACE, {
        points,
        cellOffset: 0
      });
    }

    model.VBOBuildTime.modified();
  };

  publicAPI.volumePass = (prepass, renderPass) => {
    if (prepass) {
      model.openGLRenderWindow = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderWindow');
      model.context = model.openGLRenderWindow.getContext();
      model.tris.setOpenGLRenderWindow(model.openGLRenderWindow);
      model.jitterTexture.setOpenGLRenderWindow(model.openGLRenderWindow);
      model.framebuffer.setOpenGLRenderWindow(model.openGLRenderWindow);

      // Per Component?
      model.curveTexture.setOpenGLRenderWindow(model.openGLRenderWindow);
      model.scalarTexture.setOpenGLRenderWindow(model.openGLRenderWindow);
      model.colorTexture.setOpenGLRenderWindow(model.openGLRenderWindow);
      model.opacityTexture.setOpenGLRenderWindow(model.openGLRenderWindow);

      model.openGLVolume = publicAPI.getFirstAncestorOfType('vtkCustomOpenGLVolume');
      const actor = model.openGLVolume.getRenderable();
      model.openGLRenderer = publicAPI.getFirstAncestorOfType('vtkOpenGLRenderer');
      const ren = model.openGLRenderer.getRenderable();
      model.openGLCamera = model.openGLRenderer.getViewNodeFor(ren.getActiveCamera());
      publicAPI.renderPiece(ren, actor);
    }
  };

  publicAPI.setMapperShaderParameters = (cellBO, ren, actor) => {
    // Now to update the VAO too, if necessary.
    parentClass.setMapperShaderParameters(cellBO, ren, actor);
    const program = cellBO.getProgram();

    program.setUniformi('curveTexture', model.curveTexture.getTextureUnit());
  };

  publicAPI.setCameraShaderParameters = (cellBO, ren, actor) => {
    // // [WMVP]C == {world, model, view, projection} coordinates
    // // E.g., WCPC == world to projection coordinate transformation
    const keyMats = model.openGLCamera.getKeyMatrices(ren);
    const actMats = model.openGLVolume.getKeyMatrices();

    mat4.multiply(model.modelToView, keyMats.wcvc, actMats.mcwc);

    const program = cellBO.getProgram();

    const cam = model.openGLCamera.getRenderable();
    const crange = cam.getClippingRange();
    program.setUniformf('camThick', crange[1] - crange[0]);
    program.setUniformf('camNear', crange[0]);
    program.setUniformf('camFar', crange[1]);
    // console.log('camThick', crange[1] - crange[0]);
    // console.log('camNear', crange[0]);
    // console.log('camFar', crange[1]);

    const screenRatio = 1.0;
    const bounds = model.currentInput.getBounds();
    const dims = model.currentInput.getDimensions();
    const boundsX = bounds[1] - bounds[0];
    const boundsY = bounds[5] - bounds[4];
    const volumeYXRatio = boundsY / boundsX;

    const screenAspect =
      model.openGLRenderWindow.getCanvas().width / model.openGLRenderWindow.getCanvas().height;
    const screenXRatio = screenAspect >= 1.0 ? 1.0 / screenAspect : 1.0;
    const screenYRatio = screenAspect >= 1.0 ? 1.0 : screenAspect;

    const panoAspect =
      model.renderable.getPanoCurveLength() / model.renderable.getPanoCurveHeight();
    const panoXRatio = panoAspect;
    const panoYRatio = 1.0;

    let xBound = screenXRatio * panoXRatio * volumeYXRatio;
    let yBound = screenYRatio * panoYRatio * volumeYXRatio;

    if (xBound > screenRatio) {
      yBound /= xBound;
      xBound /= xBound;
    }

    if (yBound > screenRatio) {
      xBound /= yBound;
      yBound /= yBound;
    }

    // compute the viewport bounds of the volume
    // we will only render those fragments.
    const pos = vec3.create();
    const dcxmin = -xBound;
    const dcxmax = xBound;
    const dcymin = -yBound;
    const dcymax = yBound;

    program.setUniformf('dcxmin', dcxmin);
    program.setUniformf('dcxmax', dcxmax);
    program.setUniformf('dcymin', dcymin);
    program.setUniformf('dcymax', dcymax);

    if (program.isUniformUsed('cameraParallel')) {
      program.setUniformi('cameraParallel', cam.getParallelProjection());
    }

    const ext = model.currentInput.getExtent();
    const spc = model.currentInput.getSpacing();
    const vsize = vec3.create();
    vec3.set(
      vsize,
      (ext[1] - ext[0] + 1) * spc[0],
      (ext[3] - ext[2] + 1) * spc[1],
      (ext[5] - ext[4] + 1) * spc[2]
    );
    program.setUniform3f('vSpacing', spc[0], spc[1], spc[2]);

    vec3.set(pos, ext[0], ext[2], ext[4]);
    model.currentInput.indexToWorldVec3(pos, pos);

    vec3.transformMat4(pos, pos, model.modelToView);
    // console.log('model.modelToView ; ', model.modelToView);
    // console.log('pos ; ', pos);
    program.setUniform3f('vOriginVC', pos[0], pos[1], pos[2]);
    // console.log('vOriginVC : ', pos);

    // apply the image directions
    const i2wmat4 = model.currentInput.getIndexToWorld();
    // console.log('i2wmat4 : ', i2wmat4);
    mat4.multiply(model.idxToView, model.modelToView, i2wmat4);

    mat3.multiply(model.idxNormalMatrix, keyMats.normalMatrix, actMats.normalMatrix);
    mat3.multiply(model.idxNormalMatrix, model.idxNormalMatrix, model.currentInput.getDirection());

    const maxSamples = vec3.length(vsize) / model.renderable.getSampleDistance();
    if (maxSamples > model.renderable.getMaximumSamplesPerRay()) {
      vtkWarningMacro(`The number of steps required ${Math.ceil(maxSamples)} is larger than the
        specified maximum number of steps ${model.renderable.getMaximumSamplesPerRay()}.
        Please either change the
        volumeMapper sampleDistance or its maximum number of samples.`);
    }

    const vctoijk = vec3.create();

    vec3.set(vctoijk, 1.0, 1.0, 1.0);
    vec3.divide(vctoijk, vctoijk, vsize);
    program.setUniform3f('vVCToIJK', vctoijk[0], vctoijk[1], vctoijk[2]);
    program.setUniform3i('volumeDimensions', dims[0], dims[1], dims[2]);
    // console.log('vVCToIJK', vctoijk);
    // console.log('volumeDimensions', dims);
    // console.log('vsize', vsize);

    if (!model.openGLRenderWindow.getWebgl2()) {
      const volInfo = model.scalarTexture.getVolumeInfo();
      program.setUniformf('texWidth', model.scalarTexture.getWidth());
      program.setUniformf('texHeight', model.scalarTexture.getHeight());
      program.setUniformi('xreps', volInfo.xreps);
      program.setUniformf('xstride', volInfo.xstride);
      program.setUniformf('ystride', volInfo.ystride);
    }

    // map normals through normal matrix
    // then use a point on the plane to compute the distance
    const normal = vec3.create();
    const pos2 = vec3.create();
    for (let i = 0; i < 6; ++i) {
      switch (i) {
        default:
        case 0:
          vec3.set(normal, 1.0, 0.0, 0.0);
          vec3.set(pos2, ext[1], ext[3], ext[5]);
          break;
        case 1:
          vec3.set(normal, -1.0, 0.0, 0.0);
          vec3.set(pos2, ext[0], ext[2], ext[4]);
          break;
        case 2:
          vec3.set(normal, 0.0, 1.0, 0.0);
          vec3.set(pos2, ext[1], ext[3], ext[5]);
          break;
        case 3:
          vec3.set(normal, 0.0, -1.0, 0.0);
          vec3.set(pos2, ext[0], ext[2], ext[4]);
          break;
        case 4:
          vec3.set(normal, 0.0, 0.0, 1.0);
          vec3.set(pos2, ext[1], ext[3], ext[5]);
          break;
        case 5:
          vec3.set(normal, 0.0, 0.0, -1.0);
          vec3.set(pos2, ext[0], ext[2], ext[4]);
          break;
      }
      // console.log('pos2 : ', i, pos2);
      vec3.transformMat3(normal, normal, model.idxNormalMatrix);
      vec3.transformMat4(pos2, pos2, model.idxToView);
      // console.log('model.idxNormalMatrix : ', i, model.idxNormalMatrix);
      // console.log('model.idxToView : ', i, model.idxToView);
      // console.log('pos2 : ', i, pos2);
      const dist = -1.0 * vec3.dot(pos2, normal);

      // we have the plane in view coordinates
      // specify the planes in view coordinates
      program.setUniform3f(`vPlaneNormal${i}`, normal[0], normal[1], normal[2]);
      // console.log('vPlaneNormal: ', i, normal);
      program.setUniformf(`vPlaneDistance${i}`, dist);
      // console.log('vPlaneDistance : ', i, dist);
      // console.log('ext : ', ext);
      // console.log('pos2 : ', pos2);
      // console.log("ext : ", i, ext);

      // if (actor.getProperty().getUseLabelOutline())
      {
        const image = model.currentInput;
        const worldToIndex = image.getWorldToIndex();
        // console.log(`worldToIndex${worldToIndex}`);
        // console.log(`actMats.mcwc${actMats.mcwc}`);
        const wtoModel = mat4.create();
        mat4.invert(wtoModel, actMats.mcwc);
        // console.log(`wtoModel${wtoModel}`);
        // const worldToIndex2 = mat4.create();

        // program.setUniformMatrix('vWCtoIDX', worldToIndex);
        const wToIndex = mat4.create();
        mat4.multiply(wToIndex, worldToIndex, wtoModel);
        program.setUniformMatrix('vWCtoIDX', wToIndex);

        // Get the projection coordinate to world coordinate transformation matrix.
        mat4.invert(model.projectionToWorld, keyMats.wcpc);
        program.setUniformMatrix('PCWCMatrix', model.projectionToWorld);
        // console.log('keyMats.wcpc : ', keyMats.wcpc);
        // console.log('model.projectionToWorld : ', model.projectionToWorld);
        // console.log(`model.projectionToWorld${model.projectionToWorld}`);

        const size = publicAPI.getRenderTargetSize();

        program.setUniformf('vpWidth', size[0]);
        program.setUniformf('vpHeight', size[1]);
        // console.log(`vpwidth, height${size[0]} ${size[1]}`);
      }
    }

    mat4.invert(model.projectionToView, keyMats.vcpc);
    // console.log('model.projectionToView : ', model.projectionToView);
    // console.log('keyMats.vcpc : ', keyMats.vcpc);
    program.setUniformMatrix('PCVCMatrix', model.projectionToView);

    // handle lighting values
    switch (model.lastLightComplexity) {
      default:
      case 0: // no lighting, tcolor is fine as is
        break;

      case 1: // headlight
      case 2: // light kit
      case 3: {
        // positional not implemented fallback to directional
        // mat3.transpose(keyMats.normalMatrix, keyMats.normalMatrix);
        let lightNum = 0;
        const lightColor = [];
        ren.getLights().forEach(light => {
          const status = light.getSwitch();
          if (status > 0) {
            const dColor = light.getColor();
            const intensity = light.getIntensity();
            lightColor[0] = dColor[0] * intensity;
            lightColor[1] = dColor[1] * intensity;
            lightColor[2] = dColor[2] * intensity;
            program.setUniform3fArray(`lightColor${lightNum}`, lightColor);
            const ldir = light.getDirection();
            vec3.set(normal, ldir[0], ldir[1], ldir[2]);
            vec3.transformMat3(normal, normal, keyMats.normalMatrix);
            program.setUniform3f(`lightDirectionVC${lightNum}`, normal[0], normal[1], normal[2]);
            // camera DOP is 0,0,-1.0 in VC
            const halfAngle = [-0.5 * normal[0], -0.5 * normal[1], -0.5 * (normal[2] - 1.0)];
            program.setUniform3fArray(`lightHalfAngleVC${lightNum}`, halfAngle);
            lightNum++;
          }
        });
        // mat3.transpose(keyMats.normalMatrix, keyMats.normalMatrix);
      }
    }
  };

  publicAPI.updateShaders = (cellBO, ren, actor) => {
    parentClass.updateShaders(cellBO, ren, actor);
    publicAPI.setColorShaderParameters(cellBO);
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  projectionToView: null,
  projectionToWorld: null,
  curveTexture: null
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Inheritance
  vtkOpenGLVolumeMapper.extend(publicAPI, model, initialValues);

  model.curveTexture = vtkOpenGLTexture.newInstance();

  model.projectionToView = mat4.create();
  model.projectionToWorld = mat4.create();

  // Object methods
  vtkES2DPanOpenGLVolumeMapper(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkES2DPanOpenGLVolumeMapper');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
