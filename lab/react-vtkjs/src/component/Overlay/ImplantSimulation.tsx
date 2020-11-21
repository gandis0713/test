import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import RGL, { WidthProvider } from 'react-grid-layout';
import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';

import openXmlVtiFile from '../../fileio/openXmlVtiFile';
import { ViewApis } from '../../vtkWrapper/VtkViewport/CommonDefines';
import ESView3DVolume, {
  View3DVolApis
} from '../../vtkWrapper/VtkViewport/Viewports/ESView3DVolume';
import ESView2DVolume, {
  View2DVolumeApis,
  EAxisType
} from '../../vtkWrapper/VtkViewport/Viewports/ESView2DVolume';
import implantList from '../../store/reducers/implant';

const useStyles = makeStyles({
  viewArea: {
    width: '400px',
    height: '240px'
  }
});
const ReactGridLayout = WidthProvider(RGL);
const layout1x3 = [
  { i: 'a', x: 4, y: 0, w: 2, h: 1, static: true },
  { i: 'b', x: 4, y: 1, w: 2, h: 1, static: true },
  { i: 'c', x: 4, y: 2, w: 2, h: 1, static: true },
  { i: 'd', x: 0, y: 0, w: 4, h: 3 }
];

function ImplantSimulation(): React.ReactElement {
  const [volumeData, setVolumeData] = useState<vtkImageData>();
  const [viewApis, setViewApis] = useState<Array<ViewApis>>([]);
  const [slice, setSlice] = useState<number[]>([0, 0, 0]);
  const [sliceRange, setSliceRange] = useState<number[][]>([
    [0, 10],
    [0, 10],
    [0, 10]
  ]);

  const [impPos, setImpPos] = useState<number[]>([0, 0, 0]);
  const [impRotX, setImpRotX] = useState<number>(0);
  const [croPos, setCroPos] = useState<number[]>([0, 0, 0]);
  const [croRotX, setCroRotX] = useState<number>(0);
  const [view3DApis, setView3DApis] = useState<Array<View3DVolApis>>([]);

  const classes = useStyles();

  useEffect(() => {
    openXmlVtiFile(`/testdata/volume/ct_pt.vti`).then((data: vtkImageData) => {
      setVolumeData(data);
    });
  }, []);

  const saveRenderWindow = (viewportIndex: number) => {
    return (api: ViewApis): void => {
      const newViewApis = viewApis;
      newViewApis[viewportIndex] = api;
      setViewApis(newViewApis);
    };
  };

  const save3DRenderWindow = (viewportIndex: number) => {
    return (api: View3DVolApis): void => {
      const new3DViewApis = view3DApis;
      new3DViewApis[viewportIndex] = api;
      setView3DApis(new3DViewApis);
    };
  };

  const onAxialSliceUpdated = (rangeMax: number, currentSlice: number): void => {
    console.log('onAxialSliceUpdated');

    const newSliceRange = [[1, rangeMax], sliceRange[1], sliceRange[2]];
    const newSlice = [currentSlice, slice[1], slice[2]];
    setSliceRange(newSliceRange);
    setSlice(newSlice);
  };

  const onSaggitalSliceUpdated = (rangeMax: number, currentSlice: number): void => {
    console.log('onSaggitalSliceUpdated');
    const newSliceRange = [sliceRange[0], [1, rangeMax], sliceRange[2]];
    const newSlice = [slice[0], currentSlice, slice[2]];
    setSliceRange(newSliceRange);
    setSlice(newSlice);
  };

  const onCoronalSliceUpdated = (rangeMax: number, currentSlice: number): void => {
    console.log('onCoronalSliceUpdated');
    const newSliceRange = [sliceRange[0], sliceRange[1], [1, rangeMax]];
    const newSlice = [slice[0], slice[1], currentSlice];
    setSliceRange(newSliceRange);
    setSlice(newSlice);
  };

  const onImplantPositionChanged = (
    event: React.ChangeEvent<{}> | null,
    newValue: number | number[]
  ): void => {
    const position = [newValue as number, newValue as number, newValue as number];
    setImpPos(position);
    if (view3DApis[0]) {
      (view3DApis[0] as View3DVolApis).setImplantPosition(position);
    }
  };

  const onImplantRotationXChanged = (
    event: React.ChangeEvent<{}> | null,
    newValue: number | number[]
  ): void => {
    const angle = newValue as number;
    setImpRotX(angle);
    if (view3DApis[0]) {
      (view3DApis[0] as View3DVolApis).setImplantRotation(angle);
    }
  };

  const onCrownPositionChanged = (
    event: React.ChangeEvent<{}> | null,
    newValue: number | number[]
  ): void => {
    const position = [newValue as number, newValue as number, newValue as number];
    setCroPos(position);
    if (viewApis[0]) {
      (view3DApis[0] as View3DVolApis).setCrownPosition(position);
    }
  };

  const onCrownRotationXChanged = (
    event: React.ChangeEvent<{}> | null,
    newValue: number | number[]
  ): void => {
    const angle = newValue as number;
    setCroRotX(angle);
    if (viewApis[0]) {
      (view3DApis[0] as View3DVolApis).setCrownRotation(angle);
    }
  };

  return (
    <div>
      <Typography id="title" variant="h5" gutterBottom>
        Implant Simulation
      </Typography>
      <div className={classes.viewArea}>
        <Grid container spacing={2}>
          <Grid item xs>
            <Typography variant="h6" id="continuous-slider" gutterBottom>
              Implant
            </Typography>
            <VectorSlider
              name="Position"
              value={impPos[0]}
              min={-50}
              max={50}
              step={1}
              onValueChanged={onImplantPositionChanged}
            />
            <VectorSlider
              name="Rotation"
              value={impRotX}
              min={-90}
              max={90}
              step={1}
              onValueChanged={onImplantRotationXChanged}
            />
          </Grid>
        </Grid>
        <Grid container>
          <Grid item xs>
            <Typography variant="h6" id="continuous-slider" gutterBottom>
              Crown
            </Typography>
            <VectorSlider
              name="Position"
              value={croPos[0]}
              min={-50}
              max={50}
              step={1}
              onValueChanged={onCrownPositionChanged}
            />
            <VectorSlider
              name="Rotation"
              value={croRotX}
              min={-90}
              max={90}
              step={1}
              onValueChanged={onCrownRotationXChanged}
            />
          </Grid>
        </Grid>
      </div>
      <ReactGridLayout
        className="layout"
        containerPadding={[0, 0]}
        margin={[0, 0]}
        // eslint-disable-next-line react/destructuring-assignment
        layout={layout1x3}
        cols={12}
        rowHeight={200}
        width={1200}
      >
        <div key="a">
          <ESView2DVolume
            volumeData={volumeData}
            currentSlice={slice[0]}
            sliceRange={sliceRange[0]}
            axisType={EAxisType.eAxial}
            onCreated={saveRenderWindow(0)}
            onIStyleUpdated={onAxialSliceUpdated}
          />
        </div>
        <div key="b">
          <ESView2DVolume
            volumeData={volumeData}
            currentSlice={slice[1]}
            sliceRange={sliceRange[1]}
            axisType={EAxisType.eSagittal}
            onCreated={saveRenderWindow(1)}
            onIStyleUpdated={onSaggitalSliceUpdated}
          />
        </div>
        <div key="c">
          <ESView2DVolume
            volumeData={volumeData}
            currentSlice={slice[2]}
            sliceRange={sliceRange[2]}
            axisType={EAxisType.eCoronal}
            onCreated={saveRenderWindow(2)}
            onIStyleUpdated={onCoronalSliceUpdated}
          />
        </div>
        <div key="d">
          <ESView3DVolume
            volumeData={volumeData}
            modelData={[]}
            implantData={implantList}
            onCreated={save3DRenderWindow(0)}
          />
        </div>
      </ReactGridLayout>
    </div>
  );
}

interface VectorSliderProps {
  name: string;
  value: number | number[];
  min: number;
  max: number;
  step: number;
  onValueChanged: (event: React.ChangeEvent<{}> | null, newValue: number | number[]) => void;
}

function VectorSlider(props: VectorSliderProps): React.ReactElement {
  const { name, value, min, max, step, onValueChanged } = props;
  return (
    <div>
      <Grid container spacing={2}>
        <Grid item>
          <Typography id="continuous-slider" gutterBottom>
            {name}
          </Typography>
        </Grid>
        <Grid item xs>
          <Slider
            value={value}
            aria-labelledby="continuous-slider"
            min={min}
            max={max}
            step={step}
            onChange={onValueChanged}
          />
        </Grid>
        <Grid item>
          <Typography id="continuous-slider" gutterBottom>{`${value}`}</Typography>
        </Grid>
      </Grid>
    </div>
  );
}

export default ImplantSimulation;
