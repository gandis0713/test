import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import MenuIcon from '@material-ui/icons/Menu';
import Toolbar from '@material-ui/core/Toolbar';
import IconButton from '@material-ui/core/IconButton';
import Button from '@material-ui/core/Button';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1,
    },
    tabs: {
        flexGrow: 1,
    }
  }));

function TopBar () {

    const classes = useStyles();

    const [tabIndex, setTabIndex] = useState(0);
    const changeTab = function(event, index) {
        setTabIndex(Number(index));
    }

    return (
        <div className={classes.root}>
            <AppBar>
                <Toolbar>
                    <IconButton edge="start" color="inherit">
                       <MenuIcon />
                    </IconButton>                
                    <Tabs className={classes.tabs} value={tabIndex} onChange={changeTab}>
                        <Tab label="Patient"/>
                        <Tab label="2D"     />
                        <Tab label="3D"     />
                    </Tabs>
                    <Button color="inherit">Login</Button>
                </Toolbar>
            </AppBar>
        </div>
    );
}

export default TopBar;