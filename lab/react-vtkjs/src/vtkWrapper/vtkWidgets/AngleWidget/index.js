import macro from 'vtk.js/Sources/macro';
import vtkAbstractWidgetFactory from 'vtk.js/Sources/Widgets/Core/AbstractWidgetFactory';
import vtkPlanePointManipulator from 'vtk.js/Sources/Widgets/Manipulators/PlaneManipulator';
import vtkPolyLineRepresentation from 'vtk.js/Sources/Widgets/Representations/PolyLineRepresentation';
import vtkSphereHandleRepresentation from 'vtk.js/Sources/Widgets/Representations/SphereHandleRepresentation';
import * as vtkMath from 'vtk.js/Sources/Common/Core/Math';

import { ViewTypes } from 'vtk.js/Sources/Widgets/Core/WidgetManager/Constants';
import widgetBehavior from './behavior';
import stateGenerator from './state';

// ----------------------------------------------------------------------------
// Factory
// ----------------------------------------------------------------------------

function vtkAngleWidget(publicAPI, model) {
  model.classHierarchy.push('vtkAngleWidget');

  // --- Widget Requirement ---------------------------------------------------

  model.methodsToLink = [
    'activeScaleFactor',
    'activeColor',
    'useActiveColor',
    'glyphResolution',
    'defaultScale'
  ];
  model.behavior = widgetBehavior;
  model.widgetState = stateGenerator();

  publicAPI.getRepresentationsForViewType = viewType => {
    switch (viewType) {
      case ViewTypes.DEFAULT:
      case ViewTypes.GEOMETRY:
      case ViewTypes.SLICE:
      case ViewTypes.VOLUME:
      default:
        return [
          { builder: vtkSphereHandleRepresentation, labels: ['handles'] },
          { builder: vtkSphereHandleRepresentation, labels: ['moveHandle'] },
          {
            builder: vtkPolyLineRepresentation,
            labels: ['handles', 'moveHandle']
          }
        ];
    }
  };

  // --- Public methods -------------------------------------------------------

  // Returns angle in degree
  publicAPI.getAngle = () => {
    const handles = model.widgetState.getHandleList();
    if (handles.length < 2) {
      return 0;
    }
    const point1 = handles[0];
    const point2 = handles[1];
    const point3 = handles.length === 3 ? handles[2] : model.widgetState.getMoveHandle();

    const vec1 = [0, 0, 0];
    const vec2 = [0, 0, 0];
    vtkMath.subtract(point1.getOrigin(), point2.getOrigin(), vec1);
    vtkMath.subtract(point3.getOrigin(), point2.getOrigin(), vec2);
    const radian = vtkMath.angleBetweenVectors(vec1, vec2);

    return vtkMath.degreesFromRadians(radian);
  };

  // --------------------------------------------------------------------------
  // initialization
  // --------------------------------------------------------------------------

  model.widgetState.onBoundsChange(bounds => {
    const center = [
      (bounds[0] + bounds[1]) * 0.5,
      (bounds[2] + bounds[3]) * 0.5,
      (bounds[4] + bounds[5]) * 0.5
    ];
    model.widgetState.getMoveHandle().setOrigin(center);
  });

  // Default manipulator
  model.manipulator = vtkPlanePointManipulator.newInstance();
}

// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  // manipulator: null,
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  vtkAbstractWidgetFactory.extend(publicAPI, model, initialValues);
  macro.setGet(publicAPI, model, ['manipulator']);

  vtkAngleWidget(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkAngleWidget');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
