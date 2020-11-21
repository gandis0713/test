import React, { useEffect } from 'react';
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkESRenderer from '../../../../vtk.js/Sources/Rendering/Core/ESRenderer';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkResliceCursorWidget from '../../../../vtk.js/Sources/Widgets/Widgets3D/MPRCursorWidget';
// import vtkResliceCursorWidget from '../../../../vtk.js/Sources/Widgets/Widgets3D/ResliceCursorWidget';
import vtkWidgetManager from 'vtk.js/Sources/Widgets/Core/WidgetManager';
import vtkImageMapper from 'vtk.js/Sources/Rendering/Core/ImageMapper';
import vtkImageReslice from '../../../../vtk.js/Sources/Imaging/Core/ImageReslice';
import vtkImageSlice from 'vtk.js/Sources/Rendering/Core/ImageSlice';
import vtkInteractorStyleImage from 'vtk.js/Sources/Interaction/Style/InteractorStyleImage';

import { ViewTypes, CaptureOn } from 'vtk.js/Sources/Widgets/Core/WidgetManager/Constants';
import openXmlVtiFile from '../../../common/DicomReader';

const viewAttributes = [];
const widget = vtkResliceCursorWidget.newInstance();
// widget.getWidgetState().setOpacity(0.6);
const sliceTypes = [ViewTypes.CORONAL, ViewTypes.SAGITTAL, ViewTypes.AXIAL];
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
function Reslice() {
  useEffect(() => {
    const container = document.getElementById('reslice');
    const table = document.createElement('table');
    table.setAttribute('id', 'table');
    container.appendChild(table);

    const trLine1 = document.createElement('tr');
    trLine1.setAttribute('id', 'line1');
    table.appendChild(trLine1);

    const trLine2 = document.createElement('tr');
    trLine2.setAttribute('id', 'line2');
    table.appendChild(trLine2);

    // ----------------------------------------------------------------------------
    // Setup rendering code
    // ----------------------------------------------------------------------------

    for (let i = 0; i < sliceTypes.length; i++) {
      const element = document.createElement('td');

      if (i === 2) {
        trLine2.appendChild(element);
      } else {
        trLine1.appendChild(element);
      }

      const obj = {
        renderWindow: vtkRenderWindow.newInstance(),
        renderer: vtkESRenderer.newInstance(),
        GLWindow: vtkOpenGLRenderWindow.newInstance(),
        interactor: vtkRenderWindowInteractor.newInstance(),
        widgetManager: vtkWidgetManager.newInstance()
      };

      obj.renderer.getActiveCamera().setParallelProjection(true);
      obj.renderWindow.addRenderer(obj.renderer);
      obj.renderWindow.addView(obj.GLWindow);
      obj.renderWindow.setInteractor(obj.interactor);
      obj.GLWindow.setContainer(element);
      obj.interactor.setView(obj.GLWindow);
      obj.interactor.initialize();
      obj.interactor.bindEvents(element);
      obj.interactor.setInteractorStyle(vtkInteractorStyleImage.newInstance());
      obj.widgetManager.setRenderer(obj.renderer);
      obj.widgetInstance = obj.widgetManager.addWidget(widget, sliceTypes[i]);
      obj.widgetManager.enablePicking();
      // Use to update all renderers buffer when actors are moved
      // obj.widgetManager.setCaptureOn(CaptureOn.MOUSE_MOVE);

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
        let viewType = ViewTypes.AXIAL;
        if (i === 0) {
          viewType = ViewTypes.CORONAL;
        } else if (i === 1) {
          viewType = ViewTypes.SAGITTAL;
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
        obj.renderWindow.render();
      }
    });
  }, []);
  return (
    <div>
      <div id="reslice" />
    </div>
  );
}

export default Reslice;
