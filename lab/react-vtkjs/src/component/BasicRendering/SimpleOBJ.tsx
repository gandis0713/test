import React, { useState, useEffect } from 'react';
import vtkGenericRenderWindow from 'vtk.js/Sources/Rendering/Misc/GenericRenderWindow';

import { openOBJByUrl, OBJScene } from '../../fileio/openOBJFile';

function SimpleOBJ(): React.ReactElement {
  // eslint-disable-next-line no-unused-vars, @typescript-eslint/no-unused-vars
  const [container = React.createRef<HTMLDivElement>(), setContainer] = useState();

  useEffect(() => {
    const newGenericRenderWindow = vtkGenericRenderWindow.newInstance({
      background: [0, 0, 0]
    });
    newGenericRenderWindow.setContainer(container.current);

    const rderer = newGenericRenderWindow.getRenderer();
    const rderWindow = newGenericRenderWindow.getRenderWindow();

    openOBJByUrl(`/testdata/obj/3dPhoto/DCT0000.obj`, `/testdata/obj/3dPhoto/DCT0000.mtl`)
      .then((scenes: OBJScene[]) => {
        scenes.forEach(scene => {
          console.log(`scene-name:${scene.name}`);
          rderer.addActor(scene.actor);
        });
        rderer.resetCamera();
        rderer.getActiveCamera().elevation(-89.0);
        rderWindow.render();
      })
      .catch((error: Error) => {
        console.log(error.message);
      });
  }, []);

  const style: React.CSSProperties = {
    width: '600px',
    height: '600px',
    position: 'relative'
  };

  return (
    <div style={style}>
      <h4>Simple OBJ Model (by URL)</h4>
      <div ref={container} style={style} />
    </div>
  );
}

export default SimpleOBJ;
