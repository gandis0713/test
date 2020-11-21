import React, { useState, useEffect } from 'react';

// eslint-disable-next-line max-len
import vtkInteractorStyleTrackballCamera from 'vtk.js/Sources/Interaction/Style/InteractorStyleTrackballCamera';
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
// import vtkSphereSource from 'vtk.js/Sources/Filters/Sources/SphereSource';
import vtkPolyData from 'vtk.js/Sources/Common/DataModel/PolyData';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';

import { openSTLByFile, openSTLByUrl } from '../../fileio/openSTLFile';

function SimpleSTL(): React.ReactElement {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [container = React.createRef<HTMLDivElement>(), setContainer] = useState();
  const [renderer, setRenderer] = useState<vtkRenderer>();
  const [renderWindow, setRenderWindow] = useState<vtkRenderWindow>();

  useEffect(() => {
    const newRenderWindow = vtkRenderWindow.newInstance();
    const newRenderer = vtkRenderer.newInstance();
    newRenderer.setBackground(0.0, 0.0, 0.0);
    newRenderWindow.addRenderer(newRenderer);

    const glWindow: vtkOpenGLRenderWindow = vtkOpenGLRenderWindow.newInstance();
    glWindow.setContainer(container.current);
    glWindow.setSize(600, 600);
    newRenderWindow.addView(glWindow);

    const interactor: vtkRenderWindowInteractor = vtkRenderWindowInteractor.newInstance();
    interactor.setStillUpdateRate(0.01);
    interactor.setView(glWindow);
    interactor.initialize();
    interactor.bindEvents(container.current);
    interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance());

    openSTLByUrl(`/testdata/stl/Implant01.stl`)
      .then((data: vtkPolyData) => {
        const actor = vtkActor.newInstance();
        const mapper = vtkMapper.newInstance({ scalarVisibility: false });
        actor.setMapper(mapper);
        newRenderer.addActor(actor);
        console.log(`color:${actor.getProperty().getDiffuseColor()}`);

        mapper.setInputData(data);
        actor.getProperty().setColor(0.16, 0.8, 0.43);
        newRenderer.getActiveCamera().elevation(-89.0);
        newRenderer.resetCamera();
        newRenderWindow.render();
      })
      .catch((error: Error) => {
        console.log(error.message);
        newRenderer.resetCamera();
        newRenderWindow.render();
      });

    setRenderer(newRenderer);
    setRenderWindow(newRenderWindow);
  }, []);

  const addPolyData = (data: vtkPolyData): void => {
    const actors = renderer.getActors();
    renderer.resetCamera();

    if (!actors.length) {
      const acter = vtkActor.newInstance();
      const mapper = vtkMapper.newInstance();
      mapper.setInputData(data);
      acter.setMapper(mapper);
      renderer.addActor(acter);
    } else {
      renderer
        .getActors()[0]
        .getMapper()
        .setInputData(data);
    }

    renderer.resetCamera();
    renderWindow.render();
  };

  const getModelFiles = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { files } = e.target;
    console.log(files);
    if (files && files.length > 0) {
      openSTLByFile(files[0])
        .then((data: vtkPolyData) => {
          addPolyData(data);
        })
        .catch(error => {
          console.log(error);
        });
    }
  };

  const style: React.CSSProperties = {
    width: '600px',
    height: '600px',
    position: 'relative'
  };

  return (
    <div style={style}>
      <h4>Simple STL</h4>
      <p>
        Select STL File:
        <input type="file" accept=".stl" onChange={getModelFiles} />
      </p>
      <div ref={container} style={style} />
    </div>
  );
}

export default SimpleSTL;
