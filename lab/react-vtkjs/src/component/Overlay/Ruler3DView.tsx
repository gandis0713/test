import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Select from '@material-ui/core/Select';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';
import Checkbox from '@material-ui/core/Checkbox';
import FormGroup from '@material-ui/core/FormGroup';

import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';
import vtkPolyData from 'vtk.js/Sources/Common/DataModel/PolyData';

import View3DVolumeActor, {
  View3DRulerApis
} from '../../vtkWrapper/VtkViewport/Viewports/View3DRuler';

import openXmlVtiFile from '../../fileio/openXmlVtiFile';
import { openSTLByUrl } from '../../fileio/openSTLFile';

const useStyles = makeStyles({
  root: {
    width: 400
  },
  viewArea: {
    width: '600px',
    height: '600px',
    position: 'relative',
    padding: 0
  }
});

function Ruler3DView(): React.ReactElement {
  const classes = useStyles();
  const [volumeData, setVolumeData] = useState<vtkImageData>();
  const [modelData = [], setModelData] = useState<Array<vtkPolyData>>();
  const [viewApis, setViewApis] = useState<Array<View3DRulerApis>>([]);

  const [opacity = 1.0, setOpacity] = useState<number>();
  const [valueGradDirection = 'inside', setGradDirection] = useState<'inside' | 'outside'>();
  const [valueRulerTrim = 'inside', setRulerTrim] = useState<
    'none' | 'long' | 'middle' | 'short'
  >();
  const [valueMainNumberPos = 'end', setMainNumberPos] = useState<string>();
  const [valueGraduationNumber = 'none', setGraduationNumber] = useState<string>();
  const [rulerMargin = 1, setRulerMargin] = useState<number>();
  const [isMainUnitOn = true, setMainUnitOn] = useState<boolean>();
  const [isGraduationUnitOn = false, setGraduationUnitOn] = useState<boolean>();

  useEffect(() => {
    if (volumeData) {
      // avoid duplication of data loading
      return;
    }

    openXmlVtiFile(`/testdata/volume/ct_pt.vti`).then((data: vtkImageData) => {
      setVolumeData(data);
    });
    openSTLByUrl(`/testdata/stl/mandible.stl`)
      .then((data: vtkPolyData) => {
        setModelData([...modelData, data]);

        openSTLByUrl(`/testdata/stl/axis.stl`)
          .then((axisdata: vtkPolyData) => {
            setModelData([...modelData, axisdata]);
          })
          .catch((error: Error) => {
            alert(`Failed to open stl file - ${error.message}`);
          });
      })
      .catch((error: Error) => {
        alert(`Failed to open stl file - ${error.message}`);
      });
  }, []);

  const onOpacityChanged = (
    event: React.ChangeEvent<{}> | null,
    newValue: number | number[]
  ): void => {
    if (event) {
      event.preventDefault();
    }

    console.log('onOpacityChanged');
    setOpacity(newValue as number);
    if (viewApis[0]) {
      (viewApis[0] as View3DRulerApis).setModelOpacity(newValue as number);
    }
  };

  const saveRenderWindow = (viewportIndex: number) => {
    return (api: View3DRulerApis): void => {
      const newViewApis = viewApis;
      newViewApis[viewportIndex] = api;
      setViewApis(newViewApis);
    };
  };

  const onGradDirectionChanged = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ): void => {
    if (event) {
      event.preventDefault();
      const direction = event.target.value as 'inside' | 'outside';
      setGradDirection(direction);
      if (viewApis[0]) {
        (viewApis[0] as View3DRulerApis).setGradDirection(direction);
      }
    }
  };

  const onMainNumberPosChanged = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ): void => {
    if (event) {
      event.preventDefault();
      const position = event.target.value as string;
      setMainNumberPos(position);
      if (viewApis[0]) {
        (viewApis[0] as View3DRulerApis).setMainNumberPos(position);
      }
    }
  };

  const onRulerTrimChanged = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ): void => {
    if (event) {
      event.preventDefault();
      const trim = event.target.value as 'none' | 'long' | 'middle' | 'short';
      setRulerTrim(trim);
      if (viewApis[0]) {
        (viewApis[0] as View3DRulerApis).setRulerTrim(trim);
      }
    }
  };

  const onGraduationNumberChanged = (
    event: React.ChangeEvent<{
      name?: string | undefined;
      value: unknown;
    }>
  ): void => {
    if (event) {
      event.preventDefault();
      const option = event.target.value as string;

      if (option === 'outside' || option === 'outsideTrim') {
        setRulerMargin(30);
        if (viewApis[0]) {
          (viewApis[0] as View3DRulerApis).setRulerMargin(30);
        }
      }

      setGraduationNumber(option);
      if (viewApis[0]) {
        (viewApis[0] as View3DRulerApis).setGraduationNumber(option);
      }
    }
  };

  const onRulerMarginChanged = (
    event: React.ChangeEvent<{}> | null,
    newValue: number | number[]
  ): void => {
    if (event) {
      event.preventDefault();
    }

    setRulerMargin(newValue as number);
    if (viewApis[0]) {
      (viewApis[0] as View3DRulerApis).setRulerMargin(newValue as number);
    }
  };

  const onMainUnitOnChange = (event: React.ChangeEvent<{}>, checked: boolean): void => {
    setMainUnitOn(checked);

    if (viewApis[0]) {
      (viewApis[0] as View3DRulerApis).setMainUnitOn(checked);
    }
  };

  const onGraduationUnitOnChange = (event: React.ChangeEvent<{}>, checked: boolean): void => {
    setGraduationUnitOn(checked);

    if (viewApis[0]) {
      (viewApis[0] as View3DRulerApis).setGraduationUnitOn(checked);
    }
  };

  return (
    <div className={classes.root}>
      <Typography id="volume-and-model" gutterBottom>
        3D Volume Ruler Sample
      </Typography>
      <Grid container spacing={2}>
        <Grid item xs>
          <Typography id="opacityLabek" gutterBottom>
            Model Opacity:
          </Typography>
        </Grid>
        <Grid item xs>
          <Slider value={opacity} min={0} max={1} step={0.1} onChange={onOpacityChanged} />
        </Grid>
        <Grid item>
          <Typography id="opacityValue" gutterBottom>
            {`${opacity}`}
          </Typography>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs>
          <Typography id="opacityLabek" gutterBottom>
            Ruler direction:
          </Typography>
        </Grid>
        <Grid item>
          <Select native value={valueGradDirection} onChange={onGradDirectionChanged}>
            <option value="inside">Inside</option>
            <option value="outside">Outside</option>
          </Select>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs>
          <Typography id="opacityLabek" gutterBottom>
            Main number Position:
          </Typography>
        </Grid>
        <Grid item>
          <Select native value={valueMainNumberPos} onChange={onMainNumberPosChanged}>
            <option value="start">Start</option>
            <option value="end">End</option>
            <option value="none">None</option>
          </Select>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs>
          <Typography id="opacityLabek" gutterBottom>
            Ruler trim:
          </Typography>
        </Grid>
        <Grid item>
          <Select native value={valueRulerTrim} onChange={onRulerTrimChanged}>
            <option value="none">None</option>
            <option value="long">Long</option>
            <option value="middle">Middle</option>
            <option value="short">Short</option>
          </Select>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs>
          <Typography id="opacityLabek" gutterBottom>
            Graduation number:
          </Typography>
        </Grid>
        <Grid item>
          <Select native value={valueGraduationNumber} onChange={onGraduationNumberChanged}>
            <option value="none">None</option>
            <option value="inside">Inside</option>
            <option value="insideTrim">Inside, remove first and end number</option>
            <option value="outside">Outside</option>
            <option value="outsideTrim">Outside, remove first and end number</option>
          </Select>
        </Grid>
      </Grid>
      <Grid container spacing={2}>
        <Grid item xs>
          <Typography id="opacityLabek" gutterBottom>
            Margin:
          </Typography>
        </Grid>
        <Grid item xs>
          <Slider value={rulerMargin} min={0} max={40} step={1} onChange={onRulerMarginChanged} />
        </Grid>
        <Grid item>
          <Typography id="marginValue" gutterBottom>
            {`${rulerMargin}`}
          </Typography>
        </Grid>
      </Grid>
      <Grid item>
        <FormControl component="fieldset">
          <FormGroup aria-label="filteringMode" row>
            <FormControlLabel
              checked={isMainUnitOn}
              name="mainUnit"
              onChange={onMainUnitOnChange}
              control={<Checkbox color="primary" />}
              label="Main Unit"
            />
            <FormControlLabel
              checked={isGraduationUnitOn}
              name="grduationUnit"
              onChange={onGraduationUnitOnChange}
              control={<Checkbox color="primary" />}
              label="Grauation Unit"
            />
          </FormGroup>
        </FormControl>
      </Grid>
      <div className={classes.viewArea}>
        <View3DVolumeActor
          volumeData={volumeData}
          modelData={modelData}
          onCreated={saveRenderWindow(0)}
        />
      </div>
    </div>
  );
}

export default Ruler3DView;
