import React, { useEffect } from 'react';
import vtkOpenGLRenderWindow from '../../../../vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkESRenderer from '../../../../vtk.js/Sources/Rendering/Core/ESRenderer';
import vtkRenderWindow from '../../../../vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from '../../../../vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkInteractorStyleMPR from '../../../../vtk.js/Sources/Interaction/Style/InteractorStyleMPR';
import vtkPlane from 'vtk.js/Sources/Common/DataModel/Plane';

import vtkMPRAxisWidget from '../../../../vtk.js/Sources/Widgets/Widgets3D/MPRAxisWidget';
import vtkWidgetManager from '../../../../vtk.js/Sources/Widgets/Core/WidgetManager';
import vtkImageMapper from 'vtk.js/Sources/Rendering/Core/ImageMapper';
import vtkESVolumeMapper from '../../../../vtk.js/Sources/Rendering/Core/ESVolumeMapper';
import vtkCustomPass from '../../../../vtk.js/Sources/Rendering/Core/SceneGraph/CustomPass';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkImageReslice from 'vtk.js/Sources/Imaging/Core/ImageReslice';
import vtkImageSlice from 'vtk.js/Sources/Rendering/Core/ImageSlice';

import { ViewTypes, CaptureOn } from 'vtk.js/Sources/Widgets/Core/WidgetManager/Constants';
import openXmlVtiFile from '../../../../src/common/DicomReader';

const viewAttributes = [];
const widget = vtkMPRAxisWidget.newInstance();
// widget.getWidgetState().setOpacity(0.6);
const sliceTypes = [ViewTypes.CORONAL, ViewTypes.AXIAL, ViewTypes.SAGITTAL, ViewTypes.VOLUME];
// ----------------------------------------------------------------------------
// Define html structure
// ----------------------------------------------------------------------------
function updateReslice(viewtype, reslice, actor, renderer) {
  const modified = widget.updateReslicePlane(reslice, viewtype);
  if (modified) {
    // Get returned modified from setter to know if we have to render
    actor.setUserMatrix(reslice.getResliceAxes());
    widget.resetCamera(renderer, viewtype);
  }
  return modified;
}
function ResliceSingleContext() {
  useEffect(() => {
    const renderWindow = vtkRenderWindow.newInstance();
    const glWindow = vtkOpenGLRenderWindow.newInstance();
    glWindow.setSize(600, 600);
    const customPass = vtkCustomPass.newInstance();
    glWindow.setRenderPasses([customPass]);
    renderWindow.addView(glWindow);
    const interactor = vtkRenderWindowInteractor.newInstance();
    renderWindow.setInteractor(interactor);
    const container = document.getElementById('reslice');
    glWindow.setContainer(container);
    interactor.setView(glWindow);
    interactor.initialize();
    interactor.bindEvents(container);
    const interactorStyle = vtkInteractorStyleMPR.newInstance();
    interactor.setInteractorStyle(interactorStyle);

    interactorStyle.onRotateEvent(callData => {
      switch (callData.type) {
        case 'RotateEvent':
          break;
        case 'StartRotateEvent':
          break;
        case 'EndRotateEvent':
          break;
      }
    });

    // ----------------------------------------------------------------------------
    // Setup rendering code
    // ----------------------------------------------------------------------------

    for (let i = 0; i < sliceTypes.length; i++) {
      // if (i === 2) {
      //   trLine2.appendChild(element);
      // } else {
      //   trLine1.appendChild(element);
      // }

      if (sliceTypes[i] === ViewTypes.VOLUME) {
        const obj = {
          renderer: vtkESRenderer.newInstance(),
          volume: vtkVolume.newInstance(),
          volumeMapper: vtkESVolumeMapper.newInstance(),
          viewType: sliceTypes[i]
        };

        const xMaxDim = 80;
        const xMinDim = 30;
        const yMaxDim = 50;
        const yMinDim = 0;
        const zMaxDim = 50;
        const zMinDim = 0;
        const topPlane = vtkPlane.newInstance();
        topPlane.setNormal([0, 1, 0]);
        topPlane.setOrigin([xMaxDim, yMaxDim, zMaxDim]);
        const bottomPlane = vtkPlane.newInstance();
        bottomPlane.setNormal([0, -1, 0]);
        bottomPlane.setOrigin([xMinDim, yMinDim, zMinDim]);
        const nearPlane = vtkPlane.newInstance();
        nearPlane.setNormal([0, 0, 1]);
        nearPlane.setOrigin([xMaxDim, yMaxDim, zMaxDim]);
        const farPlane = vtkPlane.newInstance();
        farPlane.setNormal([0, 0, -1]);
        farPlane.setOrigin([xMinDim, yMinDim, zMinDim]);
        const rightPlane = vtkPlane.newInstance();
        rightPlane.setNormal([1, 0, 0]);
        rightPlane.setOrigin([xMaxDim, yMaxDim, zMaxDim]);
        const leftPlane = vtkPlane.newInstance();
        leftPlane.setNormal([-1, 0, 0]);
        leftPlane.setOrigin([xMinDim, yMinDim, zMinDim]);
        obj.volumeMapper.addClippingPlane(rightPlane);
        obj.volumeMapper.addClippingPlane(leftPlane);
        obj.volumeMapper.addClippingPlane(topPlane);
        obj.volumeMapper.addClippingPlane(bottomPlane);
        obj.volumeMapper.addClippingPlane(nearPlane);
        obj.volumeMapper.addClippingPlane(farPlane);
        console.log('obj.volumeMapper : ', obj.volumeMapper.getClippingPlanes());
        obj.volume.setMapper(obj.volumeMapper);
        obj.renderer.addVolume(obj.volume);
        obj.renderer.setViewType(sliceTypes[i]);

        obj.renderer.setViewport(0.5, 0, 1.0, 0.5);

        obj.renderer.getActiveCamera().setParallelProjection(true);
        renderWindow.addRenderer(obj.renderer);
        viewAttributes.push(obj);
      } else {
        const obj = {
          renderer: vtkESRenderer.newInstance(),
          widgetManager: vtkWidgetManager.newInstance(),
          viewType: sliceTypes[i]
        };

        if (sliceTypes[i] === ViewTypes.AXIAL) {
          obj.renderer.setViewport(0, 0.5, 0.5, 1.0);
        } else if (sliceTypes[i] === ViewTypes.SAGITTAL) {
          obj.renderer.setViewport(0.5, 0.5, 1.0, 1.0);
        } else if (sliceTypes[i] === ViewTypes.CORONAL) {
          obj.renderer.setViewport(0, 0, 0.5, 0.5);
        }

        obj.renderer.getActiveCamera().setParallelProjection(true);
        obj.renderer.setViewType(sliceTypes[i]);
        renderWindow.addRenderer(obj.renderer);
        obj.widgetManager.setRenderer(obj.renderer);
        obj.widgetInstance = obj.widgetManager.addWidget(widget, sliceTypes[i]);
        obj.widgetManager.enablePicking();
        obj.widgetManager.setViewType(sliceTypes[i]);
        // Use to update all renderers buffer when actors are moved
        obj.widgetManager.setCaptureOn(CaptureOn.MOUSE_MOVE);

        obj.reslice = vtkImageReslice.newInstance();
        obj.reslice.setTransformInputSampling(false);
        obj.reslice.setAutoCropOutput(true);
        obj.reslice.setOutputDimensionality(2);
        obj.resliceMapper = vtkImageMapper.newInstance();
        obj.resliceMapper.setInputConnection(obj.reslice.getOutputPort());
        obj.resliceActor = vtkImageSlice.newInstance();
        obj.resliceActor.setMapper(obj.resliceMapper);
        viewAttributes.push(obj);
      }
    }

    // ----------------------------------------------------------------------------
    // Load image
    // ----------------------------------------------------------------------------

    openXmlVtiFile('/assets/volumes/dicom.vti').then(imageData => {
      widget.setImage(imageData);

      for (let i = 0; i < viewAttributes.length; i++) {
        const obj = viewAttributes[i];
        if (obj.viewType === ViewTypes.VOLUME) {
          obj.volumeMapper.setInputData(imageData);

          obj.volumeMapper.setSampleDistance(1);

          obj.volume
            .getProperty()
            .getRGBTransferFunction(0)
            .setMappingRange(-1250, 4250);
          obj.volumeMapper.setBlendModeToMaximumIntensity();
          obj.renderer.resetCamera();
        } else {
          obj.reslice.setInputData(imageData);
          obj.renderer.addActor(obj.resliceActor);
          const actorProp = obj.resliceActor.getProperty();
          actorProp.setColorWindow(5500);
          actorProp.setColorLevel(1500);

          const reslice = obj.reslice;
          obj.renderer.setViewType(obj.viewType);

          viewAttributes.forEach(v => {
            if (v.viewType !== ViewTypes.VOLUME) {
              v.widgetInstance.onInteractionEvent(() => {
                updateReslice(obj.viewType, reslice, obj.resliceActor, obj.renderer);
              });

              updateReslice(obj.viewType, reslice, obj.resliceActor, obj.renderer);
            }
          });
        }
      }
      renderWindow.render();
    });
  }, []);
  return (
    <div>
      <div id="reslice" style={{ width: 600, height: 600 }} />
    </div>
  );
}

export default ResliceSingleContext;
