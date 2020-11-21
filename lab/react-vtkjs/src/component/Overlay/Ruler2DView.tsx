import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';

import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import View2DRuler, {
  View2DRulerApis,
  ToolType
} from '../../vtkWrapper/VtkViewport/Viewports/View2DRuler';
import openXmlVtiFile from '../../fileio/openXmlVtiFile';

const useStyles = makeStyles({
  root: {
    width: 300
  },
  viewArea: {
    width: '600px',
    height: '600px',
    position: 'relative',
    padding: 0
  }
});

function Ruler2DView(): React.ReactElement {
  const classes = useStyles();
  const [volumeData, setVolumeData] = useState<vtkImageData>();
  const [slice, setSlice] = useState<number>(0);
  const [sliceRange, setSliceRange] = useState<number[]>([0, 10]);
  const [viewApis, setViewApis] = useState<Array<View2DRulerApis>>([]);
  // const [lengthOn, setLengthOn] = useState<boolean>(false);
  const [selectedTool, setSelectedTool] = useState<ToolType>(ToolType.eToolNone);

  useEffect(() => {
    openXmlVtiFile(`/testdata/volume/ct_pt.vti`).then((data: vtkImageData) => {
      setVolumeData(data);
    });
  }, []);

  const saveRenderWindow = (viewportIndex: number) => {
    return (api: View2DRulerApis): void => {
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
      (viewApis[0] as View2DRulerApis).setSlice(newValue as number);
    }
  };

  const onSliceUpdated = (rangeMax: number, currentSlice: number): void => {
    console.log('onSliceUpdated');
    setSliceRange([1, rangeMax]);
    setSlice(currentSlice);
  };

  const onToolSelectionChanged = (
    event: React.MouseEvent<HTMLElement, MouseEvent>,
    value: ToolType
  ): void => {
    console.log(`onToolSelectionChanged: ${event.target}`);
    console.log(`onToolSelectionChanged - value: ${value}`);
    setSelectedTool(value as ToolType);

    if (viewApis[0]) {
      (viewApis[0] as View2DRulerApis).setSelectedTool(value as ToolType);
    }
  };

  return (
    <div className={classes.root}>
      <Typography id="continuous-slider" gutterBottom>
        2D View Ruler Sample
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
          <ToggleButtonGroup
            value={selectedTool}
            exclusive
            onChange={onToolSelectionChanged}
            aria-label="text alignment"
          >
            <ToggleButton size="small" value={ToolType.eToolLength}>
              Length
            </ToggleButton>
            <ToggleButton size="small" value={ToolType.eToolAngle}>
              Angle
            </ToggleButton>
          </ToggleButtonGroup>
        </Grid>
      </Grid>
      <p />
      <div className={classes.viewArea}>
        <View2DRuler
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

export default Ruler2DView;
