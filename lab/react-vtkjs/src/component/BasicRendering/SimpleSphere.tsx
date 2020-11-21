import React, { useState, useEffect } from 'react';
import vtkGenericRenderWindow from 'vtk.js/Sources/Rendering/Misc/GenericRenderWindow';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkSphereSource from 'vtk.js/Sources/Filters/Sources/SphereSource';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';

function SimpleSphere(): React.ReactElement {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [container = React.createRef<HTMLDivElement>(), setContainer] = useState();

  useEffect(() => {
    const newGenericRenderWindow = vtkGenericRenderWindow.newInstance({
      background: [0, 0, 0]
    });
    newGenericRenderWindow.setContainer(container.current);

    const rderer = newGenericRenderWindow.getRenderer();
    const rderWindow = newGenericRenderWindow.getRenderWindow();
    const sphereSource = vtkSphereSource.newInstance();
    const actor = vtkActor.newInstance();
    const mapper = vtkMapper.newInstance();
    mapper.setInputConnection(sphereSource.getOutputPort());
    actor.setMapper(mapper);

    rderer.addActor(actor);
    rderer.resetCamera();
    rderWindow.render();
  }, []);

  const style: React.CSSProperties = {
    width: '600px',
    height: '600px',
    position: 'relative'
  };

  return (
    <div style={style}>
      <h4>Simple Sphere</h4>
      <div ref={container} style={style} />
    </div>
  );
}

export default SimpleSphere;
