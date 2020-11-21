/* eslint-disable react/jsx-wrap-multilines */
/* eslint-disable @typescript-eslint/explicit-function-return-type */
import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import Collapse from '@material-ui/core/Collapse';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import { Switch, Redirect, Route, Link as RouterLink } from 'react-router-dom';
import OBJView from './mesh/OBJ';
import STLView from './mesh/STL';
import LoadCTTest from './CT/LoadCTTest';
import DualCTTest from './CT/DualCTTest';
import ImageAdjustTest from './CT/ImageAdjust';

const mainStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  appBar: {
    zIndex: theme.zIndex.drawer + 1,
  },
  content: {
    flexGrow: 1,
    padding: theme.spacing(3),
  },
  toolbar: theme.mixins.toolbar,
}));

const exampleStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
  },
  drawer: {
    width: 240,
    flexShrink: 0,
  },
  drawerPaper: {
    width: 240,
  },
  toolbar: theme.mixins.toolbar,
}));

function ExampleList() {
  const classes = exampleStyles();
  const [meshExpand, setMeshExpand] = useState<boolean>(false);
  const [volumeExpand, setVolumeExpand] = useState<boolean>(false);
  const onMeshExpand = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setMeshExpand(!meshExpand);
  };
  const onVolumeExpand = (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    event.preventDefault();
    setVolumeExpand(!volumeExpand);
  };

  return (
    <Drawer
      className={classes.drawer}
      variant="permanent"
      classes={{
        paper: classes.drawerPaper,
      }}
    >
      <div className={classes.toolbar} />
      <List
        subheader={
          <ListSubheader>
            Mesh
            <IconButton onClick={onMeshExpand}>
              {meshExpand ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </ListSubheader>
        }
      >
        <Collapse in={meshExpand} timeout="auto" unmountOnExit={false}>
          <ListItem button key={0} component={RouterLink} to="/mesh_obj">
            Loading OBJ
          </ListItem>
          <ListItem button key={1} component={RouterLink} to="/mesh_stl">
            Loading STL
          </ListItem>
        </Collapse>
      </List>
      <List
        subheader={
          <ListSubheader>
            Volume
            <IconButton onClick={onVolumeExpand}>
              {volumeExpand ? <ExpandLess /> : <ExpandMore />}
            </IconButton>
          </ListSubheader>
        }
      >
        <Collapse in={volumeExpand} timeout="auto" unmountOnExit={false}>
          <ListItem button key={0} component={RouterLink} to="/load_ct">
            Load CT
          </ListItem>
          <ListItem button key={1} component={RouterLink} to="/dual_ct">
            Dual CT
          </ListItem>
          <ListItem button key={2} component={RouterLink} to="/image_adjust">
            ImageAdjust
          </ListItem>
        </Collapse>
      </List>
    </Drawer>
  );
}

function Main(): React.ReactElement {
  const classes = mainStyles();

  return (
    <>
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h4" noWrap>
              VTK JS Wrapper Examples
            </Typography>
          </Toolbar>
        </AppBar>
        <ExampleList />
        <div className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Route exact path="/mesh_obj" component={() => <OBJView />} />
            <Route exact path="/mesh_stl" component={() => <STLView />} />
            <Route exact path="/load_ct" component={() => <LoadCTTest />} />
            <Route exact path="/dual_ct" component={() => <DualCTTest />} />
            <Route exact path="/image_adjust" component={() => <ImageAdjustTest />} />
            <Redirect path="*" to="/" />
          </Switch>
        </div>
      </div>
    </>
  );
}

export default Main;
