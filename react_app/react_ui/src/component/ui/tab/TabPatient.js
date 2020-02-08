import React from 'react';

import { makeStyles, createStyles } from '@material-ui/core/styles';

const useStyles = makeStyles(theme => (
  createStyles({
    toolbar: theme.mixins.toolbar
  })
))

function TabPatient () {
  const classes = useStyles();

  return (
    <div className={classes.toolbar}>
      <h1>
        Container
      </h1>
    </div>
  );
}

export default TabPatient;