import React, { useState, useEffect } from 'react';
import RGL, { WidthProvider } from 'react-grid-layout';
import './Layout.css';
import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import Grid from '@material-ui/core/Grid';
import Typography from '@material-ui/core/Typography';
import Radio from '@material-ui/core/Radio';
import RadioGroup from '@material-ui/core/RadioGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import FormControl from '@material-ui/core/FormControl';

import openXmlVtiFile from '../../fileio/openXmlVtiFile';
import { ViewApis } from '../../vtkWrapper/VtkViewport/CommonDefines';
import View3DVolume from '../../vtkWrapper/VtkViewport/Viewports/View3DVolume';
import View2DImageActor from '../../vtkWrapper/VtkViewport/Viewports/View2DImage';

interface LayoutProps {
  layout: RGL.Layout[];
}

const ReactGridLayout = WidthProvider(RGL);

function MyFirstGrid(props: LayoutProps): React.ReactElement {
  const [volumeData, setVolumeData] = useState<vtkImageData>();
  const [viewApis, setViewApis] = useState<Array<ViewApis>>([]);

  useEffect(() => {
    openXmlVtiFile(`/testdata/volume/ct_pt.vti`).then((data: vtkImageData) => {
      setVolumeData(data);
    });
  }, []);

  const saveRenderWindow = (viewportIndex: number) => {
    return (api: ViewApis): void => {
      const newViewApis = viewApis;
      newViewApis[viewportIndex] = api;
      setViewApis(newViewApis);
    };
  };

  return (
    <ReactGridLayout
      className="layout"
      containerPadding={[0, 0]}
      margin={[0, 0]}
      // eslint-disable-next-line react/destructuring-assignment
      layout={props.layout}
      cols={12}
      rowHeight={200}
      width={1200}
    >
      <div key="a">
        <View2DImageActor volumeData={volumeData} onCreated={saveRenderWindow(0)} />
      </div>
      <div key="b">
        <View2DImageActor volumeData={volumeData} onCreated={saveRenderWindow(1)} />
      </div>
      <div key="c">
        <View2DImageActor volumeData={volumeData} onCreated={saveRenderWindow(2)} />
      </div>
      <div key="d">
        <View3DVolume volumeData={volumeData} modelData={[]} onCreated={saveRenderWindow(3)} />
      </div>
    </ReactGridLayout>
  );
}

const layout2x2 = [
  { i: 'a', x: 0, y: 0, w: 3, h: 1.5, static: true },
  { i: 'b', x: 3, y: 0, w: 3, h: 1.5, static: true },
  { i: 'c', x: 0, y: 1.5, w: 3, h: 1.5, static: true },
  { i: 'd', x: 3, y: 1.5, w: 3, h: 1.5 }
];

const layout1x3 = [
  { i: 'a', x: 4, y: 0, w: 2, h: 1, static: true },
  { i: 'b', x: 4, y: 1, w: 2, h: 1, static: true },
  { i: 'c', x: 4, y: 2, w: 2, h: 1, static: true },
  { i: 'd', x: 0, y: 0, w: 4, h: 3 }
];

function LayoutTest(): React.ReactElement {
  const [selectedLayout, setSelectedLayout] = useState<string>('1x3');
  const [layout, setLayout] = useState<RGL.Layout[]>(layout1x3);

  const onLayoutChanged = (event: React.ChangeEvent<HTMLInputElement>, value: string): void => {
    if (event) {
      event.preventDefault();
      console.log(event.target.value);
      setSelectedLayout(value);
      setLayout(value === '1x3' ? layout1x3 : layout2x2);
    }
  };

  return (
    <div>
      <Typography id="title" variant="h5" gutterBottom>
        Change Layout using react-grid-layout
      </Typography>
      <Grid container spacing={2}>
        <Grid item>
          <FormControl component="fieldset">
            <RadioGroup
              row
              aria-label="position"
              name="position"
              value={selectedLayout}
              onChange={onLayoutChanged}
            >
              <FormControlLabel value="1x3" control={<Radio color="primary" />} label="1x3" />
              <FormControlLabel value="2x2" control={<Radio color="primary" />} label="2x2" />
            </RadioGroup>
          </FormControl>
        </Grid>
      </Grid>
      <MyFirstGrid layout={layout} />
    </div>
  );
}

export default LayoutTest;
