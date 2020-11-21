import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Slider from '@material-ui/core/Slider';

import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import View2DImageActor, { View2DApis } from '../../vtkWrapper/VtkViewport/Viewports/View2DImage';
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

function Image2DView(): React.ReactElement {
  const classes = useStyles();
  const [volumeData, setVolumeData] = useState<vtkImageData>();
  const [slice, setSlice] = useState<number>(0);
  const [sliceRange, setSliceRange] = useState<number[]>([0, 10]);
  const [viewApis, setViewApis] = useState<Array<View2DApis>>([]);

  useEffect(() => {
    openXmlVtiFile(`/testdata/volume/ct_pt.vti`).then((data: vtkImageData) => {
      setVolumeData(data);

      const zDim = data.getDimensions()[2];
      setSliceRange([1, zDim]);
      const sl = zDim / 2;
      // eslint-disable-next-line @typescript-eslint/no-use-before-define
      onSliceChanged(null, sl);
    });
  }, []);

  const saveRenderWindow = (viewportIndex: number) => {
    return (api: View2DApis): void => {
      const newViewApis = viewApis;
      newViewApis[viewportIndex] = api;
      setViewApis(newViewApis);
    };
  };

  const onSliceChanged = (
    event: React.ChangeEvent<{}> | null,
    newValue: number | number[]
  ): void => {
    setSlice(newValue as number);
    if (viewApis[0]) {
      (viewApis[0] as View2DApis).setSlice(newValue as number);
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
            {`${slice} / ${sliceRange[1]} `}
          </Typography>
        </Grid>
      </Grid>
      <div className={classes.viewArea}>
        <View2DImageActor volumeData={volumeData} onCreated={saveRenderWindow(0)} />
      </div>
    </div>
  );
}

export default Image2DView;
