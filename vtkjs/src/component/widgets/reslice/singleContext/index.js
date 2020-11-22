import React, { useEffect } from 'react';
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkESRenderer from '../../../../../vtk.js/Sources/Rendering/Core/ESRenderer';
import vtkRenderWindow from '../../../../../vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from '../../../../../vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkMPRAxisWidget from '../../../../../vtk.js/Sources/Widgets/Widgets3D/MPRAxisWidget';
import vtkWidgetManager from '../../../../../vtk.js/Sources/Widgets/Core/WidgetManager';
import vtkImageMapper from 'vtk.js/Sources/Rendering/Core/ImageMapper';
import vtkImageReslice from 'vtk.js/Sources/Imaging/Core/ImageReslice';
import vtkImageSlice from 'vtk.js/Sources/Rendering/Core/ImageSlice';

import { ViewTypes, CaptureOn } from 'vtk.js/Sources/Widgets/Core/WidgetManager/Constants';
import openXmlVtiFile from '../../../../common/DicomReader';

const viewAttributes = [];
const widget = vtkMPRAxisWidget.newInstance();
// widget.getWidgetState().setOpacity(0.6);
const sliceTypes = [ViewTypes.CORONAL, ViewTypes.AXIAL, ViewTypes.SAGITTAL];
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
    const GLWindow = vtkOpenGLRenderWindow.newInstance();
    GLWindow.setSize(600, 600);
    renderWindow.addView(GLWindow);
    const interactor = vtkRenderWindowInteractor.newInstance();
    renderWindow.setInteractor(interactor);
    const container = document.getElementById('reslice');
    GLWindow.setContainer(container);
    interactor.setView(GLWindow);
    interactor.initialize();
    interactor.bindEvents(container);

    // ----------------------------------------------------------------------------
    // Setup rendering code
    // ----------------------------------------------------------------------------

    for (let i = 0; i < sliceTypes.length; i++) {
      // if (i === 2) {
      //   trLine2.appendChild(element);
      // } else {
      //   trLine1.appendChild(element);
      // }

      const obj = {
        renderer: vtkESRenderer.newInstance(),
        widgetManager: vtkWidgetManager.newInstance()
      };

      if (sliceTypes[i] === ViewTypes.AXIAL) {
        obj.renderer.setViewport(0, 0.5, 0.5, 1.0);
      } else if (sliceTypes[i] === ViewTypes.SAGITTAL) {
        obj.renderer.setViewport(0.5, 0.5, 1.0, 1.0);
      } else if (sliceTypes[i] === ViewTypes.CORONAL) {
        obj.renderer.setViewport(0, 0, 0.5, 0.5);
      }

      obj.renderer.getActiveCamera().setParallelProjection(true);
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

    // ----------------------------------------------------------------------------
    // Load image
    // ----------------------------------------------------------------------------

    openXmlVtiFile('/assets/volumes/dicom.vti').then(imageData => {
      widget.setImage(imageData);

      for (let i = 0; i < viewAttributes.length; i++) {
        const obj = viewAttributes[i];
        obj.reslice.setInputData(imageData);
        obj.renderer.addActor(obj.resliceActor);
        const actorProp = obj.resliceActor.getProperty();
        actorProp.setColorWindow(5500);
        actorProp.setColorLevel(1500);

        const reslice = obj.reslice;
        let viewType = ViewTypes.SAGITTAL;
        if (i === 0) {
          viewType = ViewTypes.CORONAL;
        } else if (i === 1) {
          viewType = ViewTypes.AXIAL;
        }
        obj.renderer.setViewType(viewType);

        viewAttributes
          // No need to update plane nor refresh when interaction
          // is on current view. Plane can't be changed with interaction on current
          // view. Refreshs happen automatically with `animation`.
          // Note: Need to refresh also the current view because of adding the mouse wheel
          // to change slicer
          // .filter((_, index) => index !== i)
          .forEach(v => {
            // Interactions in other views may change current plane
            v.widgetInstance.onInteractionEvent(() => {
              updateReslice(viewType, reslice, obj.resliceActor, obj.renderer);
            });
          });

        updateReslice(viewType, reslice, obj.resliceActor, obj.renderer);
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
