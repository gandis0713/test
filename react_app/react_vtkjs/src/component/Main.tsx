import React, { ReactElement } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Drawer from '@material-ui/core/Drawer';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import { Switch, Redirect, Route, Link as RouterLink } from 'react-router-dom';

import SimpleImage from './SimpleImage';
import SimpleSphere from './SimpleSphere';
import SimpleVolume from './SimpleVolume';

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
        <Drawer
          className={classes.drawer}
          variant="permanent"
          classes={{
            paper: classes.drawerPaper
          }}
        >
          <div className={classes.toolbar} />
          <List>
            <ListItem button key={0} component={RouterLink} to="/sphere">
              Simple Sphere
            </ListItem>
            <ListItem button key={1} component={RouterLink} to="/image">
              Simple Image
            </ListItem>
            <ListItem button key={2} component={RouterLink} to="/volume">
              Simple Volume
            </ListItem>
          </List>
          <Divider />
          <List />
        </Drawer>
        <div className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Route
              exact
              path="/sphere"
              component={(): ReactElement => <SimpleSphere />}
            />
            <Route
              exact
              path="/image"
              component={(): ReactElement => <SimpleImage />}
            />
            <Route
              exact
              path="/volume"
              component={(): ReactElement => <SimpleVolume />}
            />
            <Redirect path="*" to="/" />
          </Switch>
        </div>
      </div>
    </>
  );
}

export default Main;
