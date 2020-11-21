import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import Slider from '@material-ui/core/Slider';
import Button from '@material-ui/core/Button';

import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import ESView3DVolume, {
  View3DVolApis
} from '../../vtkWrapper/VtkViewport/Viewports/ESView3DVolume';

import openXmlVtiFile from '../../fileio/openXmlVtiFile';
import { VRColoringType } from '../../vtkWrapper/vtkVRColoring';
import implantList from '../../store/reducers/implant';

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

export default function VRColoring(): React.ReactElement {
  const classes = useStyles();

  const [volumeData, setVolumeData] = useState<vtkImageData>();
  const [viewApis, setViewApis] = useState<Array<View3DVolApis>>([]);

  const [opacity, setOpacity] = useState<number | number[]>(1);
  const [brightness, setBrightness] = useState<number | number[]>(0);
  const [contrast, setContrast] = useState<number | number[]>(0);

  useEffect(() => {
    if (volumeData) {
      return;
    }

    openXmlVtiFile(`/testdata/volume/ct_pt.vti`).then((imageData: vtkImageData) => {
      setVolumeData(imageData);
    });
  }, []);

  const onOpacityChanged = (
    event: React.ChangeEvent<{}> | null,
    value: number | number[]
  ): void => {
    setOpacity(value);
    if (viewApis[0]) {
      (viewApis[0] as View3DVolApis).setOpacity(value);
    }
  };

  const onBrightnessChanged = (
    event: React.ChangeEvent<{}> | null,
    value: number | number[]
  ): void => {
    setBrightness(value);
    if (viewApis[0]) {
      (viewApis[0] as View3DVolApis).setBrightness(value);
    }
  };

  const onContrastChanged = (
    event: React.ChangeEvent<{}> | null,
    value: number | number[]
  ): void => {
    setContrast(value);
    if (viewApis[0]) {
      (viewApis[0] as View3DVolApis).setContrast(value);
    }
  };

  const onClickTeeth = (event: React.MouseEvent | null): void => {
    if (viewApis[0]) {
      (viewApis[0] as View3DVolApis).setVRColoring(VRColoringType.teeth);
    }
  };

  const onClickBone = (event: React.MouseEvent | null): void => {
    if (viewApis[0]) {
      (viewApis[0] as View3DVolApis).setVRColoring(VRColoringType.bone);
    }
  };

  const onClickMIP = (event: React.MouseEvent | null): void => {
    if (viewApis[0]) {
      (viewApis[0] as View3DVolApis).setVRColoring(VRColoringType.mip);
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
      <Typography variant="h4">VR Coloring</Typography>
      <Grid container spacing={3}>
        <Grid item xs>
          <Button onClick={onClickTeeth}>Teeth</Button>
        </Grid>
        <Grid item xs>
          <Button onClick={onClickBone}>Bone</Button>
        </Grid>
        <Grid item xs>
          <Button onClick={onClickMIP}>MIP</Button>
        </Grid>
      </Grid>
      <VRColoringSubPanel
        name="Opacity"
        value={opacity}
        min={0}
        max={1}
        onValueChanged={onOpacityChanged}
      />
      <VRColoringSubPanel
        name="Brightness"
        value={brightness}
        min={-1}
        max={1}
        onValueChanged={onBrightnessChanged}
      />
      <VRColoringSubPanel
        name="Contrast"
        value={contrast}
        min={-1}
        max={1}
        onValueChanged={onContrastChanged}
      />
      <div className={classes.viewArea}>
        <ESView3DVolume
          volumeData={volumeData}
          modelData={[]}
          implantData={implantList}
          onCreated={saveRenderWindow(0)}
        />
      </div>
    </div>
  );
}

interface VRColoringSubPanelProps {
  name: string;
  value: number | number[];
  min: number;
  max: number;
  onValueChanged: (event: React.ChangeEvent<{}> | null, newValue: number | number[]) => void;
}

function VRColoringSubPanel(props: VRColoringSubPanelProps): React.ReactElement {
  const { name, value, min, max, onValueChanged } = props;
  return (
    <Grid container spacing={3}>
      <Grid item xs>
        <Typography gutterBottom>{name}</Typography>
      </Grid>
      <Grid item xs>
        <Slider value={value} min={min} max={max} step={0.01} onChange={onValueChanged} />
      </Grid>
      <Grid item xs>
        <Typography gutterBottom>{value}</Typography>
      </Grid>
    </Grid>
  );
}
