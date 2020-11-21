import macro from 'vtk.js/Sources/macro';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import Constants from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor/Constants';

function vtkESRenderWindowInteractor(publicAPI, model) {
  model.classHierarchy.push('vtkESRenderWindowInteractor');

  const superClass = { ...publicAPI };
  const eventCBs = [];

  publicAPI.bindEvents = (container) => {
    superClass.bindEvents(container);

    container.addEventListener('mouseenter', publicAPI.handleMouseEnter);
    container.addEventListener('mouseleave', publicAPI.handleMouseLeave);
  };

  publicAPI.unbindEvents = () => {
    superClass.unbindEvents();

    model.container.removeEventListener('mouseenter', publicAPI.handleMouseEnter);
    model.container.removeEventListener('mouseleave', publicAPI.handleMouseLeave);
  };

  publicAPI.handleKeyPress = (event) => {
    superClass.handleKeyPress(event);
    eventCBs.forEach((eventCB) => {
      eventCB(event);
    });
  };

  publicAPI.handleKeyDown = (event) => {
    superClass.handleKeyDown(event);
    eventCBs.forEach((eventCB) => {
      eventCB(event);
    });
  };

  publicAPI.handleKeyUp = (event) => {
    superClass.handleKeyUp(event);
    eventCBs.forEach((eventCB) => {
      eventCB(event);
    });
  };

  publicAPI.handleMouseEnter = (event) => {
    eventCBs.forEach((eventCB) => {
      eventCB(event);
    });
  };

  publicAPI.handleMouseLeave = (event) => {
    eventCBs.forEach((eventCB) => {
      eventCB(event);
    });
  };

  publicAPI.handleMouseDown = (event) => {
    superClass.handleMouseDown(event);
    eventCBs.forEach((eventCB) => {
      eventCB(event);
    });
  };

  publicAPI.handleMouseMove = (event) => {
    superClass.handleMouseMove(event);
    eventCBs.forEach((eventCB) => {
      eventCB(event);
    });
  };

  publicAPI.handleMouseUp = (event) => {
    superClass.handleMouseUp(event);
    eventCBs.forEach((eventCB) => {
      eventCB(event);
    });
  };

  publicAPI.handleTouchEnd = (event) => {
    superClass.handleTouchEnd(event);
    eventCBs.forEach((eventCB) => {
      eventCB(event);
    });
  };

  publicAPI.handleTouchMove = (event) => {
    superClass.handleTouchMove(event);
    eventCBs.forEach((eventCB) => {
      eventCB(event);
    });
  };

  publicAPI.handleTouchStart = (event) => {
    superClass.handleTouchStart(event);
    eventCBs.forEach((eventCB) => {
      eventCB(event);
    });
  };

  publicAPI.setEventCB = (eventCB) => {
    eventCBs.push(eventCB);
  };
}

const DEFAULT_VALUES = {};

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  vtkRenderWindowInteractor.extend(publicAPI, model, initialValues);

  vtkESRenderWindowInteractor(publicAPI, model);
}

export const newInstance = macro.newInstance(extend, 'vtkESRenderWindowInteractor');

export default { newInstance, extend, ...Constants };
