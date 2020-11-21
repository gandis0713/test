/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import Collapse from '@material-ui/core/Collapse';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';

import { Link as RouterLink } from 'react-router-dom';

const drawerWidth = 240;

const useStyles = makeStyles(theme => ({
  root: {
    display: 'flex'
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0
  },
  drawerPaper: {
    width: drawerWidth
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

function PrototypeList() {
  const classes = useStyles();
  const [expand1, setExpand1] = useState<boolean>(false);
  const [expand2, setExpand2] = useState<boolean>(false);
  const onClickExpand1 = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setExpand1(!expand1);
  };
  const onClickExpand2 = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setExpand2(!expand2);
  };

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper
      }}
    >
      <div className={classes.toolbar} />
      <List
        subheader={
          <ListSubheader>
            Basic Rendering
            <IconButton onClick={onClickExpand1}>
              {expand1 ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </ListSubheader>
        }
      >
        <Collapse in={expand1} timeout="auto" unmountOnExit={false}>
          <ListItem button key={0} component={RouterLink} to="/basic_sphere">
            Simple Sphere
          </ListItem>
          <ListItem button key={1} component={RouterLink} to="/basic_image">
            Simple Image
          </ListItem>
          <ListItem button key={2} component={RouterLink} to="/basic_volume">
            Simple Volume 3D
          </ListItem>
          <ListItem button key={3} component={RouterLink} to="/basic_stl">
            Simple STL
          </ListItem>
          <ListItem button key={4} component={RouterLink} to="/basic_obj">
            Simple OBJ
          </ListItem>
          <ListItem button key={5} component={RouterLink} to="/basic_section">
            Section View
          </ListItem>
        </Collapse>
      </List>
      <Divider />
      <List
        subheader={
          <ListSubheader>
            React Viewport
            <IconButton onClick={onClickExpand2}>
              {expand2 ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </ListSubheader>
        }
      >
        <Collapse in={expand2} timeout="auto" unmountOnExit={false}>
          <ListItem button key={21} component={RouterLink} to="/viewport_image2DView">
            2D Image View
          </ListItem>
          <ListItem button key={22} component={RouterLink} to="/viewport_volume2DView">
            2D Volume View
          </ListItem>
          <ListItem button key={32} component={RouterLink} to="/viewport_volume3DView">
            3D Volume and Model
          </ListItem>
        </Collapse>
      </List>
      <Divider />
      <List subheader={<ListSubheader>Overlay</ListSubheader>}>
        <ListItem button key={51} component={RouterLink} to="/overlay_measurement">
          2D View Measurement
        </ListItem>
        <ListItem button key={52} component={RouterLink} to="/overlay_ruler_2d">
          2D View Ruler
        </ListItem>
        <ListItem button key={53} component={RouterLink} to="/overlay_ruler_3d">
          3D View Ruler
        </ListItem>
        <ListItem button key={54} component={RouterLink} to="/overlay_implant">
          Implant Simulation
        </ListItem>
      </List>
      <Divider />
      <List subheader={<ListSubheader>Advanced Rendering</ListSubheader>}>
        <ListItem button key={61} component={RouterLink} to="/advenced_2dfilter">
          2D View Filtering
        </ListItem>
        <ListItem button key={62} component={RouterLink} to="/advanced_curve">
          Draw Curve
        </ListItem>
        <ListItem button key={63} component={RouterLink} to="/advanced_coloring">
          VR Coloring
        </ListItem>
        <ListItem button key={64} component={RouterLink} to="/advanced_RealtimePan">
          Realtime Panorama
        </ListItem>
      </List>
      <Divider />
      <List subheader={<ListSubheader>ETC</ListSubheader>}>
        <ListItem button key={101} component={RouterLink} to="/etc_layoutTest">
          Change Layout
        </ListItem>
        <ListItem button key={102} component={RouterLink} to="/etc_layout3DPan">
          3D Panorama
        </ListItem>
        <ListItem button key={103} component={RouterLink} to="/etc_multivolumetest">
          Multi Volume Loading Test
        </ListItem>
        <ListItem button key={104} component={RouterLink} to="/etc_multidialogvolumetest">
          Multi Dialog Volume Test
        </ListItem>
      </List>
    </Drawer>
  );
}

export default PrototypeList;
