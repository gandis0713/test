import macro from 'vtk.js/Sources/macro';

import * as vtkMath from 'vtk.js/Sources/Common/Core/Math';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkCylinderSource from 'vtk.js/Sources/Filters/Sources/CylinderSource';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkPolyData from 'vtk.js/Sources/Common/DataModel/PolyData';
import vtkWidgetRepresentation from 'vtk.js/Sources/Widgets/Representations/WidgetRepresentation';

import { RenderingTypes } from 'vtk.js/Sources/Widgets/Core/WidgetManager/Constants';

// ----------------------------------------------------------------------------
// vtkMPRCursorContextRepresentation methods
// ----------------------------------------------------------------------------

function vtkMPRCursorContextRepresentation(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkMPRCursorContextRepresentation');

  // --------------------------------------------------------------------------
  // Generic rendering pipeline
  // --------------------------------------------------------------------------

  model.mapper = vtkMapper.newInstance();
  model.actor = vtkActor.newInstance();
  model.mapper.setInputConnection(publicAPI.getOutputPort());
  model.actor.setMapper(model.mapper);
  publicAPI.addActor(model.actor);

  model.pipelines = {};
  model.pipelines.axes = [];
  const axis1 = {};
  axis1.line = {
    source: vtkCylinderSource.newInstance(),
    mapper: vtkMapper.newInstance(),
    actor: vtkActor.newInstance({ pickable: true })
  };
  const axis2 = {};
  axis2.line = {
    source: vtkCylinderSource.newInstance(),
    mapper: vtkMapper.newInstance(),
    actor: vtkActor.newInstance({ pickable: true })
  };

  model.pipelines.axes.push(axis1);
  model.pipelines.axes.push(axis2);
  model.pipelines.axes[0].line.source.setResolution(4);
  model.pipelines.axes[1].line.source.setResolution(4);

  model.pipelines.axes.forEach(axis => {
    Object.values(axis).forEach(lineHandle => {
      vtkWidgetRepresentation.connectPipeline(lineHandle);
      const actor = lineHandle.actor;
      actor.getProperty().setAmbient(1, 1, 1);
      actor.getProperty().setDiffuse(0, 0, 0);
      publicAPI.addActor(actor);
    });
  });

  publicAPI.setLineThickness = lineThickness => {
    let scaledLineThickness = lineThickness;
    if (publicAPI.getScaleInPixels()) {
      const center = model.inputData[0].getCenter();
      scaledLineThickness *= publicAPI.getPixelWorldHeightAtCoord(center);
    }
    model.pipelines.axes[0].line.source.setRadius(scaledLineThickness);
    model.pipelines.axes[1].line.source.setRadius(scaledLineThickness);
  };

  function updateRender(state, axis) {
    const color = state.getColor();
    axis.line.actor.getProperty().setColor(color);

    const vector = [0, 0, 0];
    vtkMath.subtract(state.getPoint2(), state.getPoint1(), vector);
    const center = [0, 0, 0];
    vtkMath.multiplyAccumulate(state.getPoint1(), vector, 0.5, center);
    axis.line.source.setCenter(center);
    const length = vtkMath.normalize(vector);
    axis.line.source.setDirection(vector);
    axis.line.source.setHeight(length);
  }

  /**
   * Returns the line actors in charge of translating the views.
   */
  publicAPI.getTranslationActors = () => {
    return [model.pipelines.axes[0].line.actor, model.pipelines.axes[1].line.actor];
  };

  publicAPI.requestData = (inData, outData) => {
    const state = inData[0];

    const getAxis1 = `get${model.axis1Name}`;
    const getAxis2 = `get${model.axis2Name}`;
    const axis1State = state[getAxis1]();
    const axis2State = state[getAxis2]();

    updateRender(axis1State, model.pipelines.axes[0]);
    updateRender(axis2State, model.pipelines.axes[1]);

    publicAPI.setLineThickness(state.getLineThickness());

    // TODO: return meaningful polydata (e.g. appended lines)
    outData[0] = vtkPolyData.newInstance();
  };

  publicAPI.updateActorVisibility = (renderingType, wVisible, ctxVisible, hVisible) => {
    const state = model.inputData[0];
    const visibility =
      renderingType === RenderingTypes.PICKING_BUFFER ? wVisible : wVisible && hVisible;

    publicAPI.getActors().forEach(actor => {
      actor.getProperty().setOpacity(state.getOpacity());
      let actorVisibility = visibility;

      // Conditionally display center handle but always show it for picking
      if (!state.getShowCenter() && actor === model.pipelines.center.actor) {
        actorVisibility = actorVisibility && renderingType === RenderingTypes.PICKING_BUFFER;
      }

      actor.setVisibility(actorVisibility);

      // Conditionally pick lines
      if (publicAPI.getTranslationActors().includes(actor)) {
        actor.setPickable(state.getEnableTranslation());
      }
    });
    let lineThickness = state.getLineThickness();
    if (renderingType === RenderingTypes.PICKING_BUFFER) {
      lineThickness = Math.max(3, lineThickness);
    }
    publicAPI.setLineThickness(lineThickness);
  };

  publicAPI.getSelectedState = (prop, compositeID) => {
    const state = model.inputData[0];
    state.setActiveViewName(model.viewName);

    const getAxis1 = `get${model.axis1Name}`;
    const getAxis2 = `get${model.axis2Name}`;
    const axis1State = state[getAxis1]();
    const axis2State = state[getAxis2]();

    let activeLineState = null;
    let methodName = '';

    switch (prop) {
      case model.pipelines.axes[0].line.actor:
        activeLineState = axis1State;
        methodName = 'translateAxis';
        break;
      case model.pipelines.axes[1].line.actor:
        activeLineState = axis2State;
        methodName = 'translateAxis';
        break;
      default:
        methodName = 'translateCenter';
        break;
    }

    state.setActiveLineState(activeLineState);
    state.setUpdateMethodName(methodName);

    return state;
  };
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  axis1Name: '',
  axis2Name: '',
  coincidentTopologyParameters: {
    Point: {
      factor: -1.0,
      offset: -1.0
    },
    Line: {
      factor: -1.5,
      offset: -1.5
    },
    Polygon: {
      factor: -2.0,
      offset: -2.0
    }
  },
  rotationEnabled: true,
  scaleInPixels: true,
  viewName: ''
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  vtkWidgetRepresentation.extend(publicAPI, model, initialValues);
  Object.assign(model, DEFAULT_VALUES, initialValues);

  // Object specific methods
  vtkMPRCursorContextRepresentation(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkMPRCursorContextRepresentation');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
