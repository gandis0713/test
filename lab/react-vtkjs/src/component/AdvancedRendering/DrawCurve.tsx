import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';

import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import View2DMeasurement, {
  View2DMeasurementApis,
  ToolType
} from '../../vtkWrapper/VtkViewport/Viewports/View2DMeasurement';
import openXmlVtiFile from '../../fileio/openXmlVtiFile';

const useStyles = makeStyles({
  root: {
    width: 300
  },
  viewArea: {
    width: '400px',
    height: '400px',
    position: 'relative',
    padding: 0
  }
});

function Measurement2DView(): React.ReactElement {
  const classes = useStyles();
  const [volumeData, setVolumeData] = useState<vtkImageData>();
  const [slice, setSlice] = useState<number>(0);
  const [sliceRange, setSliceRange] = useState<number[]>([0, 10]);
  const [viewApis, setViewApis] = useState<Array<View2DMeasurementApis>>([]);

  useEffect(() => {
    openXmlVtiFile(`/testdata/volume/ct_pt.vti`).then((data: vtkImageData) => {
      setVolumeData(data);
    });
  }, []);

  const saveRenderWindow = (viewportIndex: number) => {
    return (api: View2DMeasurementApis): void => {
      const newViewApis = viewApis;
      newViewApis[viewportIndex] = api;
      setViewApis(newViewApis);
    };
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
    if (viewApis[0]) {
      (viewApis[0] as View2DMeasurementApis).setSlice(newValue as number);
    }
  };

  const onSliceUpdated = (rangeMax: number, currentSlice: number): void => {
    console.log('onSliceUpdated');
    setSliceRange([1, rangeMax]);
    setSlice(currentSlice);
  };

  const onDrawCurve = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    console.log(`onDrawCurve: ${event.target}`);

    if (viewApis[0]) {
      (viewApis[0] as View2DMeasurementApis).setSelectedTool(ToolType.eToolCurve);
    }
  };

  const onReset = (event: React.MouseEvent<HTMLElement, MouseEvent>): void => {
    console.log(`onReset: ${event.target}`);

    if (viewApis[0]) {
      (viewApis[0] as View2DMeasurementApis).ResetCurve();
    }
  };

  return (
    <div className={classes.root}>
      <Typography id="continuous-slider" gutterBottom>
        Simple 2D Image Actor Viewport
      </Typography>
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
        <Grid item>
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
      <p />
      <div className={classes.viewArea}>
        <View2DMeasurement
          volumeData={volumeData}
          currentSlice={slice}
          sliceRange={sliceRange}
          onCreated={saveRenderWindow(0)}
          onIStyleUpdated={onSliceUpdated}
        />
      </div>
    </div>
  );
}

export default Measurement2DView;
