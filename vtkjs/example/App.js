import React, { useState } from 'react';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import Drawer from '@material-ui/core/Drawer';
import Collapse from '@material-ui/core/Collapse';
import ExpandLess from '@material-ui/icons/ExpandLess';
import ExpandMore from '@material-ui/icons/ExpandMore';
import IconButton from '@material-ui/core/IconButton';
import ListSubheader from '@material-ui/core/ListSubheader';
import List from '@material-ui/core/List';
import Divider from '@material-ui/core/Divider';
import ListItem from '@material-ui/core/ListItem';
import { makeStyles } from '@material-ui/core/styles';

import { Switch, Redirect, Route, Link as RouterLink } from 'react-router-dom';

import ResliceSingleContext from './component/widgets/reslice/singleContext';
import ResliceMultipleContext from './component/widgets/reslice/multipleContext';
import Viewer from './component/viewer';

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
    flexGrow: 1
  },
  toolbar: theme.mixins.toolbar
}));

function App() {
  const classes = useStyles();
  const [widgetExpand, setWidgetExpand] = useState(false);

  const onExpandWidget = event => {
    event.preventDefault();
    setWidgetExpand(!widgetExpand);
  };

  return (
    <div>
      <div className={classes.root}>
        <AppBar position="fixed" className={classes.appBar}>
          <Toolbar>
            <Typography variant="h6" noWrap>
              vtk.js prototype
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
          <Divider />
          <List
            subheader={
              <ListSubheader>
                Widgets
                <IconButton onClick={onExpandWidget}>
                  {widgetExpand ? <ExpandLess /> : <ExpandMore />}
                </IconButton>
              </ListSubheader>
            }
          >
            <Collapse in={widgetExpand} timeout="auto" unmountOnExit={false}>
              <ListItem button key={0} component={RouterLink} to="/Widgets_ResliceSingleContext">
                Reslice Single Context
              </ListItem>
              <ListItem button key={1} component={RouterLink} to="/Widgets_ResliceMultipleContext">
                Reslice Multiple Context
              </ListItem>
              <ListItem button key={2} component={RouterLink} to="/Viewer">
                Viewer
              </ListItem>
            </Collapse>
          </List>
          <Divider />
        </Drawer>
        <div className={classes.content}>
          <div className={classes.toolbar} />
          <Switch>
            <Route exact path="/Widgets_ResliceSingleContext" component={ResliceSingleContext} />
            <Route
              exact
              path="/Widgets_ResliceMultipleContext"
              component={ResliceMultipleContext}
            />
            <Route exact path="/Viewer" component={Viewer} />
          </Switch>
        </div>
      </div>
    </div>
  );
}

export default App;
