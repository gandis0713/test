import macro from 'vtk.js/Sources/macro';

import * as vtkMath from 'vtk.js/Sources/Common/Core/Math';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkCylinderSource from 'vtk.js/Sources/Filters/Sources/CylinderSource';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkPolyData from 'vtk.js/Sources/Common/DataModel/PolyData';
import vtkWidgetRepresentation from 'vtk.js/Sources/Widgets/Representations/WidgetRepresentation';

import { RenderingTypes } from 'vtk.js/Sources/Widgets/Core/WidgetManager/Constants';
import { LineType } from './Constants';

import { vec3 } from 'gl-matrix';

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
  const axis1 = [];

  for (let i = 0; i < Object.keys(LineType).length; i++) {
    axis1.push({
      source: vtkCylinderSource.newInstance(),
      mapper: vtkMapper.newInstance(),
      actor: vtkActor.newInstance({ pickable: true })
    });
  }
  axis1[LineType.lineHandle].actor.setPickable(true);

  const axis2 = [];

  for (let i = 0; i < Object.keys(LineType).length; i++) {
    axis2.push({
      source: vtkCylinderSource.newInstance(),
      mapper: vtkMapper.newInstance(),
      actor: vtkActor.newInstance({ pickable: true })
    });
  }
  axis2[LineType.lineHandle].actor.setPickable(true);

  model.pipelines.axes.push(axis1);
  model.pipelines.axes.push(axis2);
  publicAPI.setResolution = resolution => {
    model.pipelines.axes.forEach(axis => {
      axis.forEach(line => {
        line.source.setResolution(resolution);
      });
    });
  };
  publicAPI.setResolution(4);

  model.pipelines.axes.forEach(axis => {
    axis.forEach(line => {
      vtkWidgetRepresentation.connectPipeline(line);
      const actor = line.actor;
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
    model.pipelines.axes.forEach(axis => {
      axis.forEach(line => {
        line.source.setRadius(scaledLineThickness);
      });
    });
  };

  publicAPI.setLineAxisRotateLength = length => {
    model.pipelines.axes.forEach(axis => {
      axis[LineType.lineAxis1].source.setHeight(length);
      axis[LineType.lineAxis2].source.setHeight(length);
      axis[LineType.lineRotate1].source.setHeight(length);
      axis[LineType.lineRotate2].source.setHeight(length);
    });
  };

  function updateRender(state, axis) {
    const widgetState = model.inputData[0];
    const color = state.getColor();
    axis.forEach(line => {
      line.actor.getProperty().setColor(color);
    });

    const vector = [0, 0, 0];
    vtkMath.subtract(state.getPoint2(), state.getPoint1(), vector);
    const center = [0, 0, 0];
    vtkMath.multiplyAccumulate(state.getPoint1(), vector, 0.5, center);
    axis[LineType.lineHandle].source.setCenter(center);
    const length = vtkMath.normalize(vector);
    axis[LineType.lineHandle].source.setDirection(vector);
    axis[LineType.lineHandle].source.setHeight(length);
    const lineAxisRotateVector = [0, 0, 0];
    const planeNormal = widgetState[`get${model.viewName}PlaneNormal`]();
    vec3.cross(lineAxisRotateVector, vector, planeNormal);

    const lineAxisPosFromCenter = widgetState.getLineAxisPosFromCenter();
    const lineAxisCenter1 = [
      center[0] + vector[0] * lineAxisPosFromCenter,
      center[1] + vector[1] * lineAxisPosFromCenter,
      center[2] + vector[2] * lineAxisPosFromCenter
    ];
    axis[LineType.lineAxis1].source.setCenter(lineAxisCenter1);
    axis[LineType.lineAxis1].source.setDirection(lineAxisRotateVector);
    const lineAxisCenter2 = [
      center[0] - vector[0] * lineAxisPosFromCenter,
      center[1] - vector[1] * lineAxisPosFromCenter,
      center[2] - vector[2] * lineAxisPosFromCenter
    ];
    axis[LineType.lineAxis2].source.setCenter(lineAxisCenter2);
    axis[LineType.lineAxis2].source.setDirection(lineAxisRotateVector);

    const lineRotatePosFromCenter = widgetState.getLineRotatePosFromCenter();
    const lineRotateCenter1 = [
      center[0] + vector[0] * lineRotatePosFromCenter,
      center[1] + vector[1] * lineRotatePosFromCenter,
      center[2] + vector[2] * lineRotatePosFromCenter
    ];
    axis[LineType.lineRotate1].source.setCenter(lineRotateCenter1);
    axis[LineType.lineRotate1].source.setDirection(lineAxisRotateVector);
    const lineRotateCenter2 = [
      center[0] - vector[0] * lineRotatePosFromCenter,
      center[1] - vector[1] * lineRotatePosFromCenter,
      center[2] - vector[2] * lineRotatePosFromCenter
    ];
    axis[LineType.lineRotate2].source.setCenter(lineRotateCenter2);
    axis[LineType.lineRotate2].source.setDirection(lineAxisRotateVector);

    const lineAxisRotateLength = widgetState.getLineAxisRotateLength();
    publicAPI.setLineAxisRotateLength(lineAxisRotateLength);
  }

  /**
   * Returns the line actors in charge of translating the views.
   */
  publicAPI.getTranslationActors = () => {
    return [
      model.pipelines.axes[0][LineType.lineHandle].actor,
      model.pipelines.axes[1][LineType.lineHandle].actor
    ];
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

    switch (prop) {
      case model.pipelines.axes[0][LineType.lineHandle].actor:
        activeLineState = axis1State;
        break;
      case model.pipelines.axes[1][LineType.lineHandle].actor:
        activeLineState = axis2State;
        break;
      default:
        break;
    }

    state.setActiveLineState(activeLineState);

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
