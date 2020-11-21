import macro from 'vtk.js/Sources/macro';
import vtkAbstractWidgetFactory from 'vtk.js/Sources/Widgets/Core/AbstractWidgetFactory';
import vtkPlanePointManipulator from 'vtk.js/Sources/Widgets/Manipulators/PlaneManipulator';
import vtkSphereHandleRepresentation from 'vtk.js/Sources/Widgets/Representations/SphereHandleRepresentation';

import { ViewTypes } from 'vtk.js/Sources/Widgets/Core/WidgetManager/Constants';
import widgetBehavior from './behavior';
import stateGenerator from './state';

import vtkSplineContextRepresentation from '../Representation/SplineContextRepresentation';

// ----------------------------------------------------------------------------
// Factory
// ----------------------------------------------------------------------------

function vtkSplineWidget(publicAPI, model) {
  model.classHierarchy.push('vtkSplineWidget');

  // --- Widget Requirement ---------------------------------------------------

  model.methodsToLink = ['outputBorder', 'close', 'spline'];
  model.behavior = widgetBehavior;
  model.widgetState = stateGenerator();

  publicAPI.getRepresentationsForViewType = (viewType) => {
    switch (viewType) {
      case ViewTypes.DEFAULT:
      case ViewTypes.GEOMETRY:
      case ViewTypes.SLICE:
      case ViewTypes.VOLUME:
      default:
        return [
          {
            builder: vtkSphereHandleRepresentation,
            labels: ['handles', 'moveHandle'],
          },
          {
            builder: vtkSplineContextRepresentation,
            labels: ['handles', 'moveHandle'],
          },
        ];
    }
  };

  // --------------------------------------------------------------------------
  // initialization
  // --------------------------------------------------------------------------

  model.moveHandle = model.widgetState.getMoveHandle();
  // Default manipulator
  model.manipulator = vtkPlanePointManipulator.newInstance();
}

// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  keysDown: {},
  freehandMinDistance: 0.1,
  allowFreehand: true,
  resolution: 32,
  renderPoly: {
    key: 'Shift',
    status: 'down',
  },
  defaultCursor: 'pointer',
  handleSizeInPixels: 10,
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  vtkAbstractWidgetFactory.extend(publicAPI, model, initialValues);
  macro.setGet(publicAPI, model, [
    'manipulator',
    'freehandMinDistance',
    'allowFreehand',
    'resolution',
    'defaultCursor',
    'handleSizeInPixels',
  ]);

  vtkSplineWidget(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkSplineWidget');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
