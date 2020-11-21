import macro from 'vtk.js/Sources/macro';
import vtkOpenGLFramebuffer from 'vtk.js/Sources/Rendering/OpenGL/Framebuffer';
import vtkHelper from 'vtk.js/Sources/Rendering/OpenGL/Helper';
import vtkDataArray from 'vtk.js/Sources/Common/Core/DataArray';
import { Representation } from 'vtk.js/Sources/Rendering/Core/Property/Constants';
import vtkESCustomPass from './vtkESCustomPass';

// ----------------------------------------------------------------------------

function vtkES2DViewCustomPass(publicAPI, model) {
  model.classHierarchy.push('vtkES2DViewCustomPass');

  model.drawOutline = true; // set draw outline

  const setFrameBuffer = (viewNode) => {
    const size = viewNode.getFramebufferSize();

    if (!model.framebuffer) {
      model.framebuffer = vtkOpenGLFramebuffer.newInstance();
    }
    model.framebuffer.setOpenGLRenderWindow(viewNode);
    model.framebuffer.saveCurrentBindingsAndBuffers();
    const fbSize = model.framebuffer.getSize();
    if (!fbSize || fbSize[0] !== size[0] || fbSize[1] !== size[1]) {
      model.framebuffer.create(size[0], size[1]);
      model.framebuffer.populateFramebuffer();
    }
  };

  const draw2DModelOutline = (viewNode) => {
    const size = viewNode.getFramebufferSize();
    const gl = viewNode.getContext();
    gl.viewport(0, 0, size[0], size[1]);
    if (!model.copyShader) {
      model.tris.setProgram(
        viewNode
          .getShaderCache()
          .readyShaderProgramArray(
            [
              '//VTK::System::Dec',
              'attribute vec4 vertexDC;',
              'attribute vec2 tcoordTC;',
              'varying vec2 tcoord;',
              'void main() { gl_Position = vertexDC; tcoord = tcoordTC; }',
            ].join('\n'),
            [
              '//VTK::System::Dec',
              '//VTK::Output::Dec',
              'uniform sampler2D frameBufferTexture;',
              'uniform float width;',
              'uniform float height;',
              'varying vec2 tcoord;',
              'void main() { ',
              '  bool isEdge = false;',
              '  vec4 color = texture2D(frameBufferTexture, tcoord);',
              '  if(color.x != 0. || color.y != 0. || color.z != 0.) {',
              '    for(int i = -1; i <= 1; i++)',
              '    {',
              '      for(int j = -1; j <= 1; j++)',
              '      {',
              '        if(i == 0 && j == 0){',
              '          continue;',
              '        }',
              '        float x = (gl_FragCoord.x + float(i)) / width;',
              '        float y = (gl_FragCoord.y + float(j)) / height;',
              '        color = texture2D(frameBufferTexture, vec2(x, y));',
              '        if(color.x == 0. && color.y == 0. && color.z == 0.) {',
              '          isEdge = true;',
              '          break;',
              '        }',
              '      }',
              '    }',
              '  }',
              '  if(isEdge == false) {',
              '    discard;',
              '  }',
              '  else {',
              '    gl_FragData[0] = texture2D(frameBufferTexture,tcoord);',
              '  }',
              '}',
            ].join('\n'),
            ''
          )
      );
      model.tris.getShaderSourceTime().modified();

      model.tris.getVAO().bind();
      if (
        !model.tris
          .getVAO()
          .addAttributeArray(
            model.tris.getProgram(),
            model.tris.getCABO(),
            'vertexDC',
            model.tris.getCABO().getVertexOffset(),
            model.tris.getCABO().getStride(),
            gl.FLOAT,
            3,
            gl.FALSE
          )
      ) {
        console.debug('Error setting vertexDC in copy shader VAO.');
      }
      if (
        !model.tris
          .getVAO()
          .addAttributeArray(
            model.tris.getProgram(),
            model.tris.getCABO(),
            'tcoordTC',
            model.tris.getCABO().getTCoordOffset(),
            model.tris.getCABO().getStride(),
            gl.FLOAT,
            2,
            gl.FALSE
          )
      ) {
        console.debug('Error setting tcoordTC in copy shader VAO.');
      }
    } else {
      viewNode.getShaderCache().readyShaderProgram(model.tris.getProgram());
    }

    const texture = model.framebuffer.getColorTexture();
    texture.activate();

    model.tris.getProgram().setUniformi('frameBufferTexture', texture.getTextureUnit());
    model.tris.getProgram().setUniformf('width', size[0]);
    model.tris.getProgram().setUniformf('height', size[1]);

    gl.drawArrays(gl.TRIANGLES, 0, model.tris.getCABO().getElementCount());

    texture.deactivate();
    model.tris.getVAO().release();
  };

  publicAPI.traverse = (viewNode, parent = null) => {
    if (model.deleted) {
      return;
    }

    model.currentParent = parent;

    publicAPI.setCurrentOperation('buildPass');
    viewNode.traverse(publicAPI);

    const renderers = viewNode.getChildren();
    const numlayers = viewNode.getRenderable().getNumberOfLayers();

    for (let i = 0; i < numlayers; i += 1) {
      for (let index = 0; index < renderers.length; index += 1) {
        const renNode = renderers[index];
        const ren = viewNode.getRenderable().getRenderers()[index];
        if (ren.getLayer() === i) {
          model.opaqueActorCount = 0;
          model.translucentActorCount = 0;
          model.volumeCount = 0;

          publicAPI.setCurrentOperation('queryPass');
          renNode.traverse(publicAPI);

          publicAPI.setCurrentOperation('cameraPass');
          renNode.traverse(publicAPI);

          if (model.translucentActorCount > 0) {
            publicAPI.setCurrentOperation('translucentPass');
            renNode.traverse(publicAPI);
          }
          if (model.volumeCount > 0) {
            publicAPI.setCurrentOperation('volumePass');
            renNode.traverse(publicAPI);
          }

          if ((model.opaqueActorCount > 0 && model.volumeCount > 0) || model.depthRequested) {
            setFrameBuffer(viewNode);

            model.framebuffer.bind();
            publicAPI.setCurrentOperation('opaqueZBufferPass');
            renNode.traverse(publicAPI);
            model.framebuffer.restorePreviousBindingsAndBuffers();
          }

          if (model.opaqueActorCount > 0) {
            if (!model.tris.getCABO().getElementCount()) {
              model.tris.setOpenGLRenderWindow(viewNode);
              publicAPI.buildVBO();
            }

            setFrameBuffer(viewNode);
            model.framebuffer.bind();

            publicAPI.setCurrentOperation('cameraPass');
            renNode.traverse(publicAPI);

            publicAPI.setCurrentOperation('opaqueOutlinePass');
            renNode.traverse(publicAPI);

            model.framebuffer.restorePreviousBindingsAndBuffers();
            draw2DModelOutline(viewNode, parent);
          }

          if (model.opaqueActorCount > 0) {
            const camera = ren.getActiveCamera();
            const { distance } = camera.getState();
            const range = [...camera.getClippingRange()];

            const thickness = 1000; // TODO : need to be set bounds;
            camera.setClippingRange(distance - thickness, distance + thickness);

            publicAPI.setCurrentOperation('opaquePass');
            renNode.traverse(publicAPI);

            camera.setClippingRange(range);
          }
        }
      }
    }
  };

  publicAPI.buildVBO = () => {
    const ptsArray = new Float32Array([-1, -1, 0, 1, -1, 0, -1, 1, 0, 1, 1, 0]);
    const tcoordArray = new Float32Array([0, 0, 1, 0, 0, 1, 1, 1]);
    const cellArray = new Uint32Array([4, 0, 1, 3, 2]);

    const points = vtkDataArray.newInstance({
      name: 'points',
      numberOfComponents: 3,
      values: ptsArray,
    });

    points.setName('points');
    const tcoords = vtkDataArray.newInstance({
      name: 'tcoords',
      numberOfComponents: 2,
      values: tcoordArray,
    });
    tcoords.setName('tcoords');
    const cells = vtkDataArray.newInstance({
      name: 'polys',
      numberOfComponents: 1,
      values: cellArray,
    });
    cells.setName('polys');
    model.tris.getCABO().createVBO(cells, 'polys', Representation.SURFACE, {
      points,
      tcoords,
      cellOffset: 0,
    });
  };
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

  model.tris = vtkHelper.newInstance();

  // Object methods
  vtkES2DViewCustomPass(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkES2DViewCustomPass');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
