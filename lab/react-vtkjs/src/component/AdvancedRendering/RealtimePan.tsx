import React, { useState, useEffect } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
// import './Layout.css';
import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';

import openXmlVtiFile from '../../fileio/openXmlVtiFile';
import { ViewApis } from '../../vtkWrapper/VtkViewport/CommonDefines';
import ESView3DVolume, {
  View3DVolApis
} from '../../vtkWrapper/VtkViewport/Viewports/ESView3DVolume';
import ESView2DPanVolume, {
  View2DPanVolApis
} from '../../vtkWrapper/VtkViewport/Viewports/ESView2DPanVolume';

import View2DMeasurement, {
  View2DMeasurementApis,
  ToolType
} from '../../vtkWrapper/VtkViewport/Viewports/View2DMeasurement';
import { PanoCurve } from '../../store/reducers/curve';

const ReactGridLayout = WidthProvider(RGL);

const layout1x2 = [
  { i: 'a', x: 0, y: 0, w: 4, h: 2, static: true },
  { i: 'b', x: 4, y: 0, w: 4, h: 2, static: true },
  { i: 'c', x: 0, y: 2, w: 8, h: 2 }
];

function Realtime2Dlayout(): React.ReactElement {
  const [slice, setSlice] = useState<number>(0);
  const [sliceRange, setSliceRange] = useState<number[]>([0, 10]);
  const [volumeData, setVolumeData] = useState<vtkImageData>();
  const [viewApis, setViewApis] = useState<Array<ViewApis>>([]);

  useEffect(() => {
    openXmlVtiFile(`/testdata/volume/ct_pt.vti`).then((data: vtkImageData) => {
      setVolumeData(data);
    });
  }, []);

  const save3DRenderWindow = (viewportIndex: number) => {
    return (api: View3DVolApis): void => {
      const newViewApis = viewApis;
      newViewApis[viewportIndex] = api;
      setViewApis(newViewApis);
    };
  };

  const save2DRenderWindow = (viewportIndex: number) => {
    return (api: View2DMeasurementApis): void => {
      const newViewApis = viewApis;
      newViewApis[viewportIndex] = api;
      setViewApis(newViewApis);
    };
  };

  const save2DPanRenderWindow = (viewportIndex: number) => {
    return (api: View2DPanVolApis): void => {
      const newViewApis = viewApis;
      newViewApis[viewportIndex] = api;
      setViewApis(newViewApis);
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
    if (viewApis[1]) {
      (viewApis[1] as View2DMeasurementApis).setSlice(newValue as number);
    }
  };

  const onDrawCurve = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    console.log(`onDrawCurve: ${event.target}`);

    if (viewApis[1]) {
      (viewApis[1] as View2DMeasurementApis).setSelectedTool(ToolType.eToolCurve);
    }
  };

  const onReset = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    console.log(`onReset: ${event.target}`);

    if (viewApis[1]) {
      (viewApis[1] as View2DMeasurementApis).ResetCurve();
    }
  };

  const onCreatePanorama = (): void => {
    if (viewApis[2]) {
      (viewApis[2] as View2DPanVolApis).createCurve();
    }
  };

  return (
    <>
      <Grid container spacing={2}>
        <Grid item xs>
          <Slider
            value={slice}
            aria-labelledby="continuous-slider"
            min={sliceRange[0]}
            max={sliceRange[1]}
            step={1}
            onChange={onSliceChanged}
          />
        </Grid>
        <Grid item xs>
          <Typography id="continuous-slider" gutterBottom>
            {`${slice.toFixed(0)} / ${sliceRange[1].toFixed(0)} `}
          </Typography>
        </Grid>
      </Grid>
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
      <ReactGridLayout
        className="layout"
        containerPadding={[0, 0]}
        margin={[0, 0]}
        // eslint-disable-next-line react/destructuring-assignment
        layout={layout1x2}
        cols={12}
        rowHeight={200}
        width={1200}
      >
        <div key="a">
          <ESView3DVolume
            volumeData={volumeData}
            modelData={[]}
            implantData={[]}
            onCreated={save3DRenderWindow(0)}
          />
        </div>
        <div key="b">
          <View2DMeasurement
            volumeData={volumeData}
            currentSlice={slice}
            sliceRange={sliceRange}
            onCreated={save2DRenderWindow(1)}
            onIStyleUpdated={onSliceUpdated}
            onCreatePanorama={onCreatePanorama}
          />
        </div>
        <div key="c">
          <ESView2DPanVolume
            volumeData={volumeData}
            modelData={[]}
            onCreated={save2DPanRenderWindow(2)}
          />
        </div>
      </ReactGridLayout>
    </>
  );
}

function RealtimePan(): React.ReactElement {
  return (
    <div>
      <Typography id="title" variant="h5" gutterBottom>
        Realtime Panorama
      </Typography>
      <Typography id="description" variant="body1" gutterBottom>
        Click Draw Curve button and input control points to 2D View.
      </Typography>
      <Realtime2Dlayout />
    </div>
  );
}

export default RealtimePan;
