/* eslint-disable import/no-unresolved */
/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { Switch, Redirect, Route } from 'react-router-dom';

import SimpleImage from './BasicRendering/SimpleImage';
import SimpleSphere from './BasicRendering/SimpleSphere';
import SimpleVolume from './BasicRendering/SimpleVolume';
import SimpleSTL from './BasicRendering/SimpleSTL';
import SimpleOBJ from './BasicRendering/SimpleOBJ';
import SectionView from './BasicRendering/SectionView';
import Image2DView from './ReactViewport/Image2DView';
import Volume2DView from './ReactViewport/Volume2DView';
import Volume3DView from './ReactViewport/Volume3DView';
import Measurement2DView from './Overlay/Measurement2DView';
import Ruler2DView from './Overlay/Ruler2DView';
import Ruler3DView from './Overlay/Ruler3DView';
import ImplantSimulation from './Overlay/ImplantSimulation';
import DrawCurve from './AdvancedRendering/DrawCurve';
import VRColoring from './AdvancedRendering/VRColoring';
import RealtimePan from './AdvancedRendering/RealtimePan';
import Filtering2DView from './AdvancedRendering/Filtering2DView';
import LayoutTest from './ETC/LayoutTest';
import Layout3DPan from './ETC/Layout3Dpan';
import PrototypeList from './PrototypeList';
import MultiVolumeTest from './ETC/MultiVolumeTest';
import MultiDialogVolumeTest from './ETC/MultiDialogVolumeTest';

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3)
  },
  framedBox: {
    borderWidth: 2,
    borderColor: '#3f51b5',
    borderStyle: 'solid',
    marginTop: 0
  },
  toolbar: theme.mixins.toolbar
}));

function Main(): React.ReactElement {
  const classes = useStyles();

  return (
    <>
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" noWrap>
              3D Viewer Prototype
            </Typography>
          </Toolbar>
        </AppBar>
        <PrototypeList />
        <div className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Route exact path="/basic_sphere" component={() => <SimpleSphere />} />
            <Route exact path="/basic_image" component={() => <SimpleImage />} />
            <Route exact path="/basic_volume" component={() => <SimpleVolume />} />
            <Route exact path="/basic_stl" component={() => <SimpleSTL />} />
            <Route exact path="/basic_obj" component={() => <SimpleOBJ />} />
            <Route exact path="/basic_section" component={() => <SectionView />} />
            <Route exact path="/viewport_image2DView" component={() => <Image2DView />} />
            <Route exact path="/viewport_volume2DView" component={() => <Volume2DView />} />
            <Route exact path="/viewport_volume3DView" component={() => <Volume3DView />} />
            <Route exact path="/overlay_measurement" component={() => <Measurement2DView />} />
            <Route exact path="/overlay_ruler_2d" component={() => <Ruler2DView />} />
            <Route exact path="/overlay_ruler_3d" component={() => <Ruler3DView />} />
            <Route exact path="/overlay_implant" component={() => <ImplantSimulation />} />
            <Route exact path="/advanced_curve" component={() => <DrawCurve />} />
            <Route exact path="/advanced_coloring" component={() => <VRColoring />} />
            <Route exact path="/advenced_2dfilter" component={() => <Filtering2DView />} />
            <Route exact path="/advanced_RealtimePan" component={() => <RealtimePan />} />
            <Route exact path="/etc_layoutTest" component={() => <LayoutTest />} />
            <Route exact path="/etc_layout3DPan" component={() => <Layout3DPan />} />
            <Route exact path="/etc_multivolumetest" component={() => <MultiVolumeTest />} />
            <Route
              exact
              path="/etc_multidialogvolumetest"
              component={() => <MultiDialogVolumeTest />}
            />
            <Redirect path="*" to="/" />
          </Switch>
        </div>
      </div>
    </>
  );
}

export default Main;
