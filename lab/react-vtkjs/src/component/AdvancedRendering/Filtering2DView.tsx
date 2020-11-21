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
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';

import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import ESView2DVolume, {
  View2DVolumeApis,
  EAxisType
} from '../../vtkWrapper/VtkViewport/Viewports/ESView2DVolume';
import { E2DViewRenderMode, E2DViewFilteringMode } from '../../vtkWrapper/vtkActor/ESVolumeActor2D';
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

function Filtering2DView(): React.ReactElement {
  const classes = useStyles();
  const [volumeData, setVolumeData] = useState<vtkImageData>();
  const [slice, setSlice] = useState<number>(0);
  const [sliceRange, setSliceRange] = useState<number[]>([0, 10]);
  const [axisType, setAxisType] = useState<EAxisType>(EAxisType.eAxial);
  const [viewApis, setViewApis] = useState<Array<View2DVolumeApis>>([]);
  const [thickness, setThickness] = useState<number>(1);
  const [selectedFileter, setSelectedFilter] = React.useState<E2DViewFilteringMode>(
    E2DViewFilteringMode.eFilterNone
  );

  useEffect(() => {
    openXmlVtiFile(`/testdata/volume/ct_pt.vti`).then((data: vtkImageData) => {
      setVolumeData(data);
      if (viewApis[0]) {
        (viewApis[0] as View2DVolumeApis).setThickness(thickness);
      }
    });
  }, []);

  const saveRenderWindow = (viewportIndex: number) => {
    return (api: View2DVolumeApis): void => {
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
      (viewApis[0] as View2DVolumeApis).setSlice(newValue as number);
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
        (viewApis[0] as View2DVolumeApis).setAxisType(axis);
      }
    }
  };

  const onRenderModeChanged = (event: React.ChangeEvent<HTMLInputElement>): void => {
    if (event) {
      event.preventDefault();
      console.log(event.target.value);
      if (viewApis[0]) {
        (viewApis[0] as View2DVolumeApis).setRenderMode(event.target.value as E2DViewRenderMode);
      }
    }
  };

  const onThicknessChanged = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ): void => {
    if (event) {
      event.preventDefault();
      const thick = parseFloat(event.target.value as string);
      setThickness(thick);
      if (viewApis[0]) {
        (viewApis[0] as View2DVolumeApis).setThickness(thick);
      }
    }
  };

  const onFilteringChange = (event: React.ChangeEvent<{}>, checked: boolean): void => {
    // const { value } = event.target.name;
    console.log();
    const { name } = event.target as HTMLInputElement;
    let filterMode: E2DViewFilteringMode = E2DViewFilteringMode.eFilterNone;
    if (name === 'sharpen' && checked === true) {
      filterMode = E2DViewFilteringMode.eFilterSharpen;
    } else if (name === 'smooth' && checked === true) {
      filterMode = E2DViewFilteringMode.eFilterSmooth;
    } else {
      // do nothing
    }

    setSelectedFilter(filterMode);

    if (viewApis[0]) {
      (viewApis[0] as View2DVolumeApis).setFilteringMode(filterMode);
    }
  };

  return (
    <div className={classes.root}>
      <Typography id="continuous-slider" gutterBottom>
        2D View Filtering
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
      <Grid container spacing={2}>
        <Grid item>
          <Select native value={thickness} onChange={onThicknessChanged}>
            <option value={1.0}>1.0mm</option>
            <option value={5.0}>5.0mm</option>
            <option value={10.0}>10.0mm</option>
            <option value={20.0}>20.0mm</option>
          </Select>
        </Grid>
        <Grid item>
          <FormControl component="fieldset">
            <FormGroup aria-label="filteringMode" row>
              <FormControlLabel
                checked={selectedFileter === E2DViewFilteringMode.eFilterSmooth}
                name="smooth"
                onChange={onFilteringChange}
                control={<Checkbox color="primary" />}
                label="Smooth"
              />
              <FormControlLabel
                checked={selectedFileter === E2DViewFilteringMode.eFilterSharpen}
                name="sharpen"
                onChange={onFilteringChange}
                control={<Checkbox color="primary" />}
                label="Sharpen"
              />
            </FormGroup>
          </FormControl>
        </Grid>
      </Grid>
      <p />
      <div className={classes.viewArea}>
        <ESView2DVolume
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

export default Filtering2DView;
