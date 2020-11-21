# es-vtkjs-wrapper

vtk-js wrapper library

## Install

```bash
yarn add @ewoosoft/es-vtkjs-wrapper@git+https://es-vtkjs-wrapper:KEz4zYsNUs1VzDLgBjfD@gitlab.com/ewoosoft/prototypes/vpopviewer-frontend-prototype/es-vtkjs-wrapper.git
```

Note: The token will be expired at 2025-12-31.

## Setting in CRA(Create-React-App) Application

The vtk.js requires a webpack configuration, but CRA project doesn't provide webpack configuration without eject.
The @craco/craco library helps webpack configuration of CRA project.

Install @craco/craco and craco-vtk.

```bash
yarn add @craco/craco craco-vtk
```

Add webpack setting and script setting for craco according to the follow document.

- https://github.com/thewtex/craco-vtk

## Usage

```tsx
import React from 'react';

import Vtk3DViewer from '@ewoosoft/es-vtkjs-wrapper';

const App = (): React.ReactElement => {
  return <Vtk3DViewer id="1111" />;
};

export default App;
```

## Usage of the inner example

```bash
yarn start
```

# Example project

See https://gitlab.com/ewoosoft/prototypes/es-vtkjs-wrapper-example.
