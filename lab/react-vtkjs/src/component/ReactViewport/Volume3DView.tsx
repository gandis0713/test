import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';

import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';
import vtkPolyData from 'vtk.js/Sources/Common/DataModel/PolyData';

import View3DVolumeActor, {
  View3DVolApis
} from '../../vtkWrapper/VtkViewport/Viewports/View3DVolume';

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

function Volume3DView(): React.ReactElement {
  const classes = useStyles();
  const [volumeData, setVolumeData] = useState<vtkImageData>();
  const [modelData = [], setModelData] = useState<Array<vtkPolyData>>();
  const [viewApis, setViewApis] = useState<Array<View3DVolApis>>([]);

  const [opacity = 1.0, setOpacity] = useState<number>();

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
      (viewApis[0] as View3DVolApis).setModelOpacity(newValue as number);
    }
  };

  const saveRenderWindow = (viewportIndex: number) => {
    return (api: View3DVolApis): void => {
      const newViewApis = viewApis;
      newViewApis[viewportIndex] = api;
      setViewApis(newViewApis);
    };
  };

  return (
    <div className={classes.root}>
      <Typography id="volume-and-model" gutterBottom>
        3D Volume and Model Viewer
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

export default Volume3DView;
