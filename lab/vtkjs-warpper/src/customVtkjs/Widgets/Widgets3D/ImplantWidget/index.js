import macro from 'vtk.js/Sources/macro';
import vtkAbstractWidgetFactory from 'vtk.js/Sources/Widgets/Core/AbstractWidgetFactory';

import { ViewTypes } from 'vtk.js/Sources/Widgets/Core/WidgetManager/Constants';
import vtkPlanePointManipulator from 'vtk.js/Sources/Widgets/Manipulators/PlaneManipulator';
import stateGenerator from './state';
import widgetBehavior from './behavior';
import vtkImplantRepresentation from '../../Representation/ImplantRepresentation';

// ----------------------------------------------------------------------------
// Factory
// ----------------------------------------------------------------------------

function vtkImplantWidget(publicAPI, model) {
  model.classHierarchy.push('vtkImplantWidget');

  // --- Widget Requirement ---------------------------------------------------

  model.methodsToLink = ['activeScaleFactor', 'activeColor', 'useActiveColor', 'defaultScale'];
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
            builder: vtkImplantRepresentation,
            labels: ['handles'],
          },
        ];
    }
  };

  // Default manipulator
  model.manipulator = vtkPlanePointManipulator.newInstance();
}

// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  // manipulator: null,
  actionType: 'Implant',
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  vtkAbstractWidgetFactory.extend(publicAPI, model, initialValues);

  macro.setGet(publicAPI, model, ['manipulator']);

  vtkImplantWidget(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkImplantWidget');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
