import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import Select from '@material-ui/core/Select';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import View2DVolumeActor, {
  View2DVolActorApis,
  EAxisType
} from '../../vtkWrapper/VtkViewport/Viewports/View2DVolume';
import { E2DViewRenderMode } from '../../vtkWrapper/vtkActor/VolumeActor2D';
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

function Volume2DView(): React.ReactElement {
  const classes = useStyles();
  const [volumeData, setVolumeData] = useState<vtkImageData>();
  const [slice, setSlice] = useState<number>(0);
  const [sliceRange, setSliceRange] = useState<number[]>([0, 10]);
  const [axisType, setAxisType] = useState<EAxisType>(EAxisType.eAxial);
  const [viewApis, setViewApis] = useState<Array<View2DVolActorApis>>([]);

  useEffect(() => {
    openXmlVtiFile(`/testdata/volume/ct_pt.vti`).then((data: vtkImageData) => {
      setVolumeData(data);
    });
  }, []);

  const saveRenderWindow = (viewportIndex: number) => {
    return (api: View2DVolActorApis): void => {
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
      (viewApis[0] as View2DVolActorApis).setSlice(newValue as number);
    }
  };

  const onSliceUpdated = (rangeMax: number, currentSlice: number): void => {
    console.log('onSliceUpdated');
    setSliceRange([1, rangeMax]);
    setSlice(currentSlice);
  };

  const onAxisChanged = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ): void => {
    if (event) {
      event.preventDefault();
      const axis: EAxisType = event.target.value as EAxisType;
      console.log(`axis Type${axis}`);
      setAxisType(axis);
      if (viewApis[0]) {
        (viewApis[0] as View2DVolActorApis).setAxisType(axis);
      }
    }
  };

  const onRenderModeChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event) {
      event.preventDefault();
      console.log(event.target.value);
      if (viewApis[0]) {
        (viewApis[0] as View2DVolActorApis).setRenderMode(event.target.value as E2DViewRenderMode);
      }
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
        <Grid item>
          <Select native value={axisType} onChange={onAxisChanged}>
            <option value={EAxisType.eAxial}>Axial</option>
            <option value={EAxisType.eSagittal}>Sagittal</option>
            <option value={EAxisType.eCoronal}>Coronal</option>
          </Select>
        </Grid>
        <Grid item>
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="position"
              name="position"
              defaultValue={E2DViewRenderMode.eAverage}
              onChange={onRenderModeChanged}
            >
              <FormControlLabel
                value={E2DViewRenderMode.eAverage}
                control={<Radio color="primary" />}
                label="Average"
              />
              <FormControlLabel
                value={E2DViewRenderMode.eMIP}
                control={<Radio color="primary" />}
                label="MIP"
              />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
      <p />
      <div className={classes.viewArea}>
        <View2DVolumeActor
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

export default Volume2DView;
