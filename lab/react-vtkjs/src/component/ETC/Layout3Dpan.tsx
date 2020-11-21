import React, { useState, useEffect } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';

import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';
import { vec3, mat4 } from 'gl-matrix';
import Win32Dialog from 'react-win32dialog';
import openMultiDcmFiles from '../../fileio/openMultiDcmFiles';
import openXmlVtiFile from '../../fileio/openXmlVtiFile';
import { LoadDicomFiles, IResultLoadingDicom } from '../../fileio/dicomLoader';
import ESView2DPanVolume, {
  View2DPanVolApis
} from '../../vtkWrapper/VtkViewport/Viewports/ESView2DPanVolume';
import View2DMeasurement, {
  View2DMeasurementApis,
  ToolType
} from '../../vtkWrapper/VtkViewport/Viewports/View2DMeasurement';
import ESView2DSectionVolume, {
  View2DSectionVolumeApis
} from '../../vtkWrapper/VtkViewport/Viewports/ESView2DSectionVolume';

import panoCurveState from '../../store/reducers/curve';

const ReactGridLayout = WidthProvider(RGL);

const layout2x4 = [
  { i: 'a', x: 0, y: 0, w: 18, h: 2, static: true },
  { i: 'b', x: 0, y: 2, w: 6, h: 2, static: true },
  { i: 'c', x: 6, y: 2, w: 4, h: 2, static: true },
  { i: 'd', x: 10, y: 2, w: 4, h: 2, static: true },
  { i: 'e', x: 14, y: 2, w: 4, h: 2, static: true }
];

function Layout3DPan(): React.ReactElement {
  const [slice, setSlice] = useState<number>(0);
  const [sliceRange, setSliceRange] = useState<number[]>([0, 10]);
  const [volumeData, setVolumeData] = useState<vtkImageData>();
  const [view2DPanApis, setView2DPanApis] = useState<Array<View2DPanVolApis>>([]);
  const [view2DMeasureApis, setView2DMeasureApis] = useState<Array<View2DMeasurementApis>>([]);
  const [view2DSectionApis, setView2DSectionApis] = useState<Array<View2DSectionVolumeApis>>([]);

  const callback = (i: number): void => {
    console.log('percent : ', i);
  };

  function getDcmFiles(e: React.ChangeEvent<HTMLInputElement>): void {
    const { files } = e.target;
    if (files) {
      LoadDicomFiles(files, callback)
        // openMultiDcmFiles(files)
        .then((result: IResultLoadingDicom) => {
          setVolumeData(result.data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  }

  useEffect(() => {
    // openXmlVtiFile(`/testdata/volume/ct_pt.vti`).then((imageData: vtkImageData) => {
    //   setVolumeData(imageData);
    // });
  }, []);

  const save2DMeasureRenderWindow = (viewportIndex: number) => {
    return (api: View2DMeasurementApis): void => {
      const newViewApis = view2DMeasureApis;
      newViewApis[viewportIndex] = api;
      setView2DMeasureApis(newViewApis);
    };
  };

  const save2DPanRenderWindow = (viewportIndex: number) => {
    return (api: View2DPanVolApis): void => {
      const newViewApis = view2DPanApis;
      newViewApis[viewportIndex] = api;
      setView2DPanApis(newViewApis);
    };
  };

  const save2DSectionRenderWindow = (viewportIndex: number) => {
    return (api: View2DSectionVolumeApis): void => {
      const newViewApis = view2DSectionApis;
      newViewApis[viewportIndex] = api;
      setView2DSectionApis(newViewApis);
    };
  };

  const onSliceUpdated = (rangeMax: number, currentSlice: number): void => {
    console.log('onSliceUpdated');
    setSliceRange([1, rangeMax]);
    setSlice(currentSlice);
  };

  const onSliceChanged = (
    event: React.ChangeEvent<{}> | null,
    newValue: number | number[]
  ): void => {
    if (event) {
      event.preventDefault();
    }

    console.log('onSliceChanged');
    setSlice(newValue as number);
    if (view2DMeasureApis[0]) {
      (view2DMeasureApis[0] as View2DMeasurementApis).setSlice(newValue as number);
    }
  };

  const onDrawCurve = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    console.log(`onDrawCurve: ${event.target}`);

    if (view2DMeasureApis[0]) {
      (view2DMeasureApis[0] as View2DMeasurementApis).setSelectedTool(ToolType.eToolCurve);
    }
  };

  const onReset = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    console.log(`onReset: ${event.target}`);

    if (view2DMeasureApis[0]) {
      (view2DMeasureApis[0] as View2DMeasurementApis).ResetCurve();
    }
  };

  const setSectionView = (): void => {
    if (panoCurveState.data.length < 3) {
      return;
    }

    /**
     * coordination is changed. The below need to be check.
     */

    const curveData: vec3[] = [];
    const normalForward: vec3[] = [];
    const normalRight: vec3[] = [];

    const matXRot = mat4.create();
    mat4.fromXRotation(matXRot, (-89.99 * Math.PI) / 180.0);

    const sectionCount = view2DSectionApis.length;
    const sectionStart = panoCurveState.sectionCenter - Math.floor(sectionCount / 2);
    for (let i = 0; i < sectionCount; i++) {
      curveData[i] = vec3.create();
      curveData[i][0] = panoCurveState.data[sectionStart + i][0];
      curveData[i][1] = panoCurveState.data[sectionStart + i][1];
      curveData[i][2] = panoCurveState.data[sectionStart + i][2];
      normalForward[i] = vec3.create();
      normalForward[i][0] = panoCurveState.normal.forward[sectionStart + i][0];
      normalForward[i][1] = panoCurveState.normal.forward[sectionStart + i][1];
      normalForward[i][2] = panoCurveState.normal.forward[sectionStart + i][2];
      normalRight[i] = vec3.create();
      normalRight[i][0] = panoCurveState.normal.right[sectionStart + i][0];
      normalRight[i][1] = panoCurveState.normal.right[sectionStart + i][1];
      normalRight[i][2] = panoCurveState.normal.right[sectionStart + i][2];
      curveData[i][0] = (1.0 - curveData[i][0]) * 100 - 50;
      curveData[i][2] = curveData[i][1] * 100 - 50;
      curveData[i][1] = 0;

      vec3.transformMat4(normalForward[i], normalForward[i], matXRot);
      vec3.transformMat4(normalRight[i], normalRight[i], matXRot);
      vec3.normalize(normalForward[i], normalForward[i]);
      vec3.normalize(normalRight[i], normalRight[i]);
    }

    for (let i = 0; i < sectionCount; i++) {
      if (view2DSectionApis[i]) {
        (view2DSectionApis[i] as View2DSectionVolumeApis).setAxis(
          curveData[i],
          normalForward[i],
          normalRight[i]
        );
        (view2DSectionApis[i] as View2DSectionVolumeApis).setSectionNumber(sectionStart + i + 1);
      }
    }
  };

  const onSectionChanged = (dir: number): void => {
    if (dir > 0 && panoCurveState.sectionCenter > panoCurveState.data.length - 3) {
      return;
    }

    if (dir < 0 && panoCurveState.sectionCenter < 2) {
      return;
    }

    panoCurveState.sectionCenter += dir;

    setSectionView();
  };

  const onCreatePanorama = (): void => {
    if (view2DPanApis[0]) {
      const startTime = performance.now();
      (view2DPanApis[0] as View2DPanVolApis).createCurve();

      const endTime = performance.now();
      const timeDiff = endTime - startTime;
      const seconds = Math.round(timeDiff);
      console.log('The time for creating panorama : ', seconds, ' milliseconds.');
    }

    setSectionView();
  };
  return (
    <Win32Dialog
      x={250}
      y={80}
      width={1200}
      height={900}
      minWidth={1200}
      minHeight={900}
      title="3D panorama"
      onExit={(): boolean => true}
    >
      <div>
        <Grid container spacing={2}>
          <Grid item xs>
            <input type="file" accept=".dcm" onChange={getDcmFiles} multiple />
          </Grid>
          <Grid item xs={1}>
            <Slider
              value={slice}
              aria-labelledby="continuous-slider"
              min={sliceRange[0]}
              max={sliceRange[1]}
              step={1}
              onChange={onSliceChanged}
            />
          </Grid>
          <Grid item xs={1}>
            <Typography id="continuous-slider" gutterBottom>
              {`${slice.toFixed(0)} / ${sliceRange[1].toFixed(0)} `}
            </Typography>
          </Grid>
        </Grid>
        <Grid container spacing={2} />
        <Grid container spacing={2}>
          <Grid item xs>
            <Button variant="contained" color="primary" size="small" onClick={onDrawCurve}>
              Draw Curve
            </Button>
            <Button variant="contained" color="primary" size="small" onClick={onReset}>
              Reset
            </Button>
          </Grid>
        </Grid>
      </div>
      <div>
        <ReactGridLayout
          className="layout"
          containerPadding={[0, 0]}
          margin={[0, 0]}
          // eslint-disable-next-line react/destructuring-assignment
          layout={layout2x4}
          cols={18}
          rowHeight={200}
          width={1200}
        >
          <div key="a">
            <ESView2DPanVolume
              volumeData={volumeData}
              modelData={[]}
              onCreated={save2DPanRenderWindow(0)}
            />
          </div>
          <div key="b">
            <View2DMeasurement
              volumeData={volumeData}
              currentSlice={slice}
              sliceRange={sliceRange}
              onCreated={save2DMeasureRenderWindow(0)}
              onIStyleUpdated={onSliceUpdated}
              onCreatePanorama={onCreatePanorama}
            />
          </div>
          <div key="c">
            <ESView2DSectionVolume
              volumeData={volumeData}
              onCreated={save2DSectionRenderWindow(0)}
              onSectionChanged={onSectionChanged}
            />
          </div>
          <div key="d">
            <ESView2DSectionVolume
              volumeData={volumeData}
              onCreated={save2DSectionRenderWindow(1)}
              onSectionChanged={onSectionChanged}
            />
          </div>
          <div key="e">
            <ESView2DSectionVolume
              volumeData={volumeData}
              onCreated={save2DSectionRenderWindow(2)}
              onSectionChanged={onSectionChanged}
            />
          </div>
        </ReactGridLayout>
      </div>
    </Win32Dialog>
  );
}

export default Layout3DPan;
