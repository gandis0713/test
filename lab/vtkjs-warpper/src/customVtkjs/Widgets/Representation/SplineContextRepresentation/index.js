import macro from 'vtk.js/Sources/macro';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkHandleRepresentation from 'vtk.js/Sources/Widgets/Representations/HandleRepresentation';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkPolyData from 'vtk.js/Sources/Common/DataModel/PolyData';
import vtkTriangleFilter from 'vtk.js/Sources/Filters/General/TriangleFilter';
import vtkLineFilter from 'vtk.js/Sources/Filters/General/LineFilter';

import { splineKind } from '../../../Common/DataModel/Spline3D/Constants';
import vtkSpline3D from '../../../Common/DataModel/Spline3D';

// ----------------------------------------------------------------------------
// vtkSplineContextRepresentation methods
// ----------------------------------------------------------------------------

function vtkSplineContextRepresentation(publicAPI, model) {
  // Set our className
  model.classHierarchy.push('vtkSplineContextRepresentation');

  // --------------------------------------------------------------------------
  // Generic rendering pipeline
  // --------------------------------------------------------------------------

  model.pipelines = {
    area: {
      actor: vtkActor.newInstance(),
      mapper: vtkMapper.newInstance(),
      triangleFilter: vtkTriangleFilter.newInstance(),
    },
    border: {
      actor: vtkActor.newInstance(),
      mapper: vtkMapper.newInstance(),
      lineFilter: vtkLineFilter.newInstance(),
    },
  };

  model.pipelines.area.triangleFilter.setInputConnection(publicAPI.getOutputPort());
  model.pipelines.area.mapper.setInputConnection(
    model.pipelines.area.triangleFilter.getOutputPort()
  );
  model.pipelines.area.actor.setMapper(model.pipelines.area.mapper);
  model.pipelines.area.actor.getProperty().setOpacity(0.2);
  model.pipelines.area.actor.getProperty().setColor(0, 1, 0);
  model.actors.push(model.pipelines.area.actor);

  model.pipelines.border.lineFilter.setInputConnection(publicAPI.getOutputPort());
  model.pipelines.border.mapper.setInputConnection(
    model.pipelines.border.lineFilter.getOutputPort()
  );
  model.pipelines.border.actor.setMapper(model.pipelines.border.mapper);
  model.pipelines.border.actor.getProperty().setOpacity(1);
  model.pipelines.border.actor.getProperty().setColor(0.1, 1, 0.1);
  model.pipelines.border.actor.setVisibility(model.outputBorder);

  model.actors.push(model.pipelines.border.actor);

  // --------------------------------------------------------------------------

  publicAPI.requestData = (inData, outData) => {
    if (model.deleted) {
      return;
    }

    const polydata = vtkPolyData.newInstance();

    const list = publicAPI
      .getRepresentationStates(inData[0])
      .filter((state) => state.getVisible && state.getVisible());

    const inPoints = list.map((state) => state.getOrigin());
    console.log('inPoints : ', inPoints);
    if (inPoints.length <= 1) {
      outData[0] = polydata;
      return;
    }

    // set number of vertices by spline type. (by charles)
    const numVertices = model.close === true ? inPoints.length : inPoints.length - 1;
    if (model.close) {
      inPoints.push(inPoints[0]);
    }

    // set extra count for cell of polydata by spline type. (by charles)
    const numExtraCount = model.close === true ? 2 : 0;

    // set extra index for cell of polydata by spline type. (by charles)
    const numExtraIndex = model.close === true ? 1 : 0;

    model.spline = vtkSpline3D.newInstance({
      close: model.close,
      kind: splineKind.KOCHANEK_SPLINE,
    });
    model.spline.computeCoefficients(inPoints);

    const outPoints = new Float32Array(3 * numVertices * model.resolution);
    const outCells = new Uint32Array(numVertices * model.resolution + numExtraCount);
    if (model.close) {
      outCells[0] = numVertices * model.resolution + 1;
      outCells[numVertices * model.resolution + 1] = 0;
    }

    for (let i = 0; i < numVertices; i++) {
      for (let j = 0; j < model.resolution; j++) {
        const t = j / model.resolution;
        const point = model.spline.getPoint(i, t);

        outPoints[3 * (i * model.resolution + j) + 0] = point[0];
        outPoints[3 * (i * model.resolution + j) + 1] = point[1];
        outPoints[3 * (i * model.resolution + j) + 2] = point[2];

        outCells[i * model.resolution + j + numExtraIndex] = i * model.resolution + j;
      }
    }

    polydata.getPoints().setData(outPoints);
    if (model.fill && model.close) {
      polydata.getPolys().setData(outCells);
    }

    if (model.outputBorder) {
      polydata.getLines().setData(outCells);
      model.pipelines.border.actor.setVisibility(true);
    } else {
      polydata.getLines().setData([]);
      model.pipelines.border.actor.setVisibility(false);
    }

    outData[0] = polydata;

    model.pipelines.area.triangleFilter.update();
    model.pipelines.border.actor
      .getProperty()
      .setColor(
        ...(inPoints.length <= 3 || model.pipelines.area.triangleFilter.getErrorCount() === 0
          ? model.borderColor
          : model.errorBorderColor)
      );
  };

  publicAPI.getSelectedState = (prop, compositeID) => model.state;
}

// ----------------------------------------------------------------------------
// Object factory
// ----------------------------------------------------------------------------

const DEFAULT_VALUES = {
  resolution: 16,
  close: true,
  fill: true,
  outputBorder: false,
  borderColor: [0.1, 1, 0.1],
  errorBorderColor: [1, 0, 0],
  spline: null,
};

// ----------------------------------------------------------------------------

export function extend(publicAPI, model, initialValues = {}) {
  Object.assign(model, DEFAULT_VALUES, initialValues);

  vtkHandleRepresentation.extend(publicAPI, model, initialValues);
  macro.get(publicAPI, model, ['mapper']);
  macro.setGet(publicAPI, model, [
    'resolution',
    'close',
    'fill',
    'outputBorder',
    'borderColor',
    'errorBorderColor',
    'spline',
  ]);

  // Object specific methods
  vtkSplineContextRepresentation(publicAPI, model);
}

// ----------------------------------------------------------------------------

export const newInstance = macro.newInstance(extend, 'vtkSplineContextRepresentation');

// ----------------------------------------------------------------------------

export default { newInstance, extend };
