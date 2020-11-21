import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Divider from '@material-ui/core/Divider';
import Slider from '@material-ui/core/Slider';
import { vec3 } from 'gl-matrix';

import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import ESView2DSectionVolume, {
  View2DSectionVolumeApis
} from '../../vtkWrapper/VtkViewport/Viewports/ESView2DSectionVolume';
import openXmlVtiFile from '../../fileio/openXmlVtiFile';

const useStyles = makeStyles({
  root: {
    width: 300
  },
  viewArea: {
    width: '600px',
    height: '600px',
    position: 'absolute',
    padding: 0,
    top: '200px',
    left: '600px'
  }
});

function SectionView(): React.ReactElement {
  const classes = useStyles();
  const [volumeData, setVolumeData] = useState<vtkImageData>();
  const [width, setWidth] = useState<number>(120);
  const [height, setHeight] = useState<number>(120);
  const [viewApis, setViewApis] = useState<Array<View2DSectionVolumeApis>>([]);
  const [normalForward, setNormalForward] = useState<number[]>([0, 0, -1]);
  const [normalRight, setNormalRight] = useState<number[]>([1, 0, 0]);
  const [cameraFocalPoint, setCameraFocalPoint] = useState<number[]>([0, 0, 0]);
  const [cameraZoom, setCameraZoom] = useState<number>(1.0);

  useEffect(() => {
    openXmlVtiFile(`/testdata/volume/ct_pt.vti`).then((data: vtkImageData) => {
      setVolumeData(data);
      if (viewApis[0]) {
        (viewApis[0] as View2DSectionVolumeApis).setThickness(1.0);
        (viewApis[0] as View2DSectionVolumeApis).setCameraZoom(1.0);
        (viewApis[0] as View2DSectionVolumeApis).setAxis(
          cameraFocalPoint,
          normalForward,
          normalRight
        );
        (viewApis[0] as View2DSectionVolumeApis).setWidth(width);
        (viewApis[0] as View2DSectionVolumeApis).setHeight(height);
      }
    });
  }, []);

  const saveRenderWindow = (viewportIndex: number) => {
    return (api: View2DSectionVolumeApis): void => {
      const newViewApis = viewApis;
      newViewApis[viewportIndex] = api;
      setViewApis(newViewApis);
    };
  };

  const onWidthChanged = (
    event: React.ChangeEvent<{}> | null,
    newValue: number | number[]
  ): void => {
    if (event) {
      event.preventDefault();
    }

    console.log('onWidthChanged');
    setWidth(newValue as number);
    if (viewApis[0]) {
      (viewApis[0] as View2DSectionVolumeApis).setWidth(newValue as number);
    }
  };

  const onHeightChanged = (
    event: React.ChangeEvent<{}> | null,
    newValue: number | number[]
  ): void => {
    if (event) {
      event.preventDefault();
    }

    console.log('onHeightChanged');
    setHeight(newValue as number);
    if (viewApis[0]) {
      (viewApis[0] as View2DSectionVolumeApis).setHeight(newValue as number);
    }
  };

  const onNormalForwardXChanged = (
    event: React.ChangeEvent<{}> | null,
    newValue: number | number[]
  ): void => {
    setNormalForward([newValue as number, normalForward[1], normalForward[2]]);
    if (viewApis[0]) {
      const nForward = vec3.create();
      vec3.normalize(nForward, normalForward);
      const nRight = vec3.create();
      vec3.normalize(nRight, normalRight);
      (viewApis[0] as View2DSectionVolumeApis).setAxis(cameraFocalPoint, nForward, nRight);
    }
  };

  const onNormalForwardYChanged = (
    event: React.ChangeEvent<{}> | null,
    newValue: number | number[]
  ): void => {
    setNormalForward([normalForward[0], newValue as number, normalForward[2]]);
    if (viewApis[0]) {
      const nForward = vec3.create();
      vec3.normalize(nForward, normalForward);
      const nRight = vec3.create();
      vec3.normalize(nRight, normalRight);
      (viewApis[0] as View2DSectionVolumeApis).setAxis(cameraFocalPoint, nForward, nRight);
    }
  };

  const onNormalForwardZChanged = (
    event: React.ChangeEvent<{}> | null,
    newValue: number | number[]
  ): void => {
    setNormalForward([normalForward[0], normalForward[1], newValue as number]);
    if (viewApis[0]) {
      const nForward = vec3.create();
      vec3.normalize(nForward, normalForward);
      const nRight = vec3.create();
      vec3.normalize(nRight, normalRight);
      (viewApis[0] as View2DSectionVolumeApis).setAxis(cameraFocalPoint, nForward, nRight);
    }
  };

  const onNormalRightXChanged = (
    event: React.ChangeEvent<{}> | null,
    newValue: number | number[]
  ): void => {
    setNormalRight([newValue as number, normalRight[1], normalRight[2]]);
    if (viewApis[0]) {
      const nForward = vec3.create();
      vec3.normalize(nForward, normalForward);
      const nRight = vec3.create();
      vec3.normalize(nRight, normalRight);
      (viewApis[0] as View2DSectionVolumeApis).setAxis(cameraFocalPoint, nForward, nRight);
    }
  };

  const onNormalRightYChanged = (
    event: React.ChangeEvent<{}> | null,
    newValue: number | number[]
  ): void => {
    setNormalRight([normalRight[0], newValue as number, normalRight[2]]);
    if (viewApis[0]) {
      const nForward = vec3.create();
      vec3.normalize(nForward, normalForward);
      const nRight = vec3.create();
      vec3.normalize(nRight, normalRight);
      (viewApis[0] as View2DSectionVolumeApis).setAxis(cameraFocalPoint, nForward, nRight);
    }
  };

  const onNormalRightZChanged = (
    event: React.ChangeEvent<{}> | null,
    newValue: number | number[]
  ): void => {
    setNormalRight([normalRight[0], normalRight[1], newValue as number]);
    if (viewApis[0]) {
      const nForward = vec3.create();
      vec3.normalize(nForward, normalForward);
      const nRight = vec3.create();
      vec3.normalize(nRight, normalRight);
      (viewApis[0] as View2DSectionVolumeApis).setAxis(cameraFocalPoint, nForward, nRight);
    }
  };

  const onCameraFocalPointXChanged = (
    event: React.ChangeEvent<{}> | null,
    newValue: number | number[]
  ): void => {
    const newFocalPoint: number[] = [newValue as number, cameraFocalPoint[1], cameraFocalPoint[2]];
    setCameraFocalPoint(newFocalPoint);
    if (viewApis[0]) {
      const nForward = vec3.create();
      vec3.normalize(nForward, normalForward);
      const nRight = vec3.create();
      vec3.normalize(nRight, normalRight);
      (viewApis[0] as View2DSectionVolumeApis).setAxis(newFocalPoint, nForward, nRight);
    }
  };

  const onCameraFocalPointYChanged = (
    event: React.ChangeEvent<{}> | null,
    newValue: number | number[]
  ): void => {
    const newFocalPoint: number[] = [cameraFocalPoint[0], newValue as number, cameraFocalPoint[2]];
    setCameraFocalPoint(newFocalPoint);
    if (viewApis[0]) {
      const nForward = vec3.create();
      vec3.normalize(nForward, normalForward);
      const nRight = vec3.create();
      vec3.normalize(nRight, normalRight);
      (viewApis[0] as View2DSectionVolumeApis).setAxis(newFocalPoint, nForward, nRight);
    }
  };

  const onCameraFocalPointZChanged = (
    event: React.ChangeEvent<{}> | null,
    newValue: number | number[]
  ): void => {
    const newFocalPoint: number[] = [cameraFocalPoint[0], cameraFocalPoint[1], newValue as number];
    setCameraFocalPoint(newFocalPoint);
    if (viewApis[0]) {
      const nForward = vec3.create();
      vec3.normalize(nForward, normalForward);
      const nRight = vec3.create();
      vec3.normalize(nRight, normalRight);
      (viewApis[0] as View2DSectionVolumeApis).setAxis(newFocalPoint, nForward, nRight);
    }
  };

  const onCameraZoomChanged = (
    event: React.ChangeEvent<{}> | null,
    newValue: number | number[]
  ): void => {
    setCameraZoom(newValue as number);
    if (viewApis[0]) {
      (viewApis[0] as View2DSectionVolumeApis).setCameraZoom(newValue as number);
    }
  };

  return (
    <div className={classes.root}>
      <Typography variant="h3" id="continuous-slider" gutterBottom>
        Section View
      </Typography>
      <Grid container>
        <Typography variant="h4" id="continuous-slider" gutterBottom>
          Camera
        </Typography>
      </Grid>
      <Divider />
      <Grid container>
        <Typography variant="h5" id="continuous-slider" gutterBottom>
          Normal
        </Typography>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs>
          <Typography id="continuous-slider" gutterBottom>
            Forward
          </Typography>
          <VectorSlider
            name="X"
            value={normalForward[0]}
            min={-1}
            max={1}
            step={0.01}
            onValueChanged={onNormalForwardXChanged}
          />
          <VectorSlider
            name="Y"
            value={normalForward[1]}
            min={-1}
            max={1}
            step={0.01}
            onValueChanged={onNormalForwardYChanged}
          />
          <VectorSlider
            name="Z"
            value={normalForward[2]}
            min={-1}
            max={1}
            step={0.01}
            onValueChanged={onNormalForwardZChanged}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item xs>
          <Typography id="continuous-slider" gutterBottom>
            Right
          </Typography>
          <VectorSlider
            name="X"
            value={normalRight[0]}
            min={-1}
            max={1}
            step={0.01}
            onValueChanged={onNormalRightXChanged}
          />
          <VectorSlider
            name="Y"
            value={normalRight[1]}
            min={-1}
            max={1}
            step={0.01}
            onValueChanged={onNormalRightYChanged}
          />
          <VectorSlider
            name="Z"
            value={normalRight[2]}
            min={-1}
            max={1}
            step={0.01}
            onValueChanged={onNormalRightZChanged}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Typography variant="h5" id="continuous-slider" gutterBottom>
          Focal Point
        </Typography>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs>
          <VectorSlider
            name="X"
            value={cameraFocalPoint[0]}
            min={-50}
            max={50}
            step={1}
            onValueChanged={onCameraFocalPointXChanged}
          />
          <VectorSlider
            name="Y"
            value={cameraFocalPoint[1]}
            min={-40}
            max={40}
            step={1}
            onValueChanged={onCameraFocalPointYChanged}
          />
          <VectorSlider
            name="Z"
            value={cameraFocalPoint[2]}
            min={-50}
            max={50}
            step={1}
            onValueChanged={onCameraFocalPointZChanged}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Typography variant="h5" id="continuous-slider" gutterBottom>
          Zoom
        </Typography>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs>
          <VectorSlider
            name=""
            value={cameraZoom}
            min={0.1}
            max={5.0}
            step={0.1}
            onValueChanged={onCameraZoomChanged}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Typography variant="h4" id="continuous-slider" gutterBottom>
          Image
        </Typography>
      </Grid>
      <Divider />
      <Grid container>
        <Typography variant="h5" id="continuous-slider" gutterBottom>
          Size
        </Typography>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs>
          <Typography id="continuous-slider" gutterBottom>
            Width
          </Typography>
          <Grid item xs>
            <Slider
              value={width}
              aria-labelledby="continuous-slider"
              min={0}
              max={120}
              step={1}
              onChange={onWidthChanged}
            />
          </Grid>
          <Grid item>
            <Typography id="continuous-slider" gutterBottom>
              {`${width}`}
            </Typography>
          </Grid>
        </Grid>
        <Grid item xs>
          <Typography id="continuous-slider" gutterBottom>
            Height
          </Typography>
          <Grid item xs>
            <Grid item xs>
              <Slider
                value={height}
                aria-labelledby="continuous-slider"
                min={0}
                max={120}
                step={1}
                onChange={onHeightChanged}
              />
            </Grid>
            <Grid item>
              <Typography id="continuous-slider" gutterBottom>
                {`${height}`}
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
      <Grid container spacing={2} />
      <p />
      <div className={classes.viewArea}>
        <ESView2DSectionVolume volumeData={volumeData} onCreated={saveRenderWindow(0)} />
      </div>
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

export default SectionView;
