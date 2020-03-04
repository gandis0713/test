import React, { useState, useEffect } from "react";
import vtkGenericRenderWindow from "vtk.js/Sources/Rendering/Misc/GenericRenderWindow";
import vtkImageMapper from "vtk.js/Sources/Rendering/Core/ImageMapper";
import vtkImageSlice from "vtk.js/Sources/Rendering/Core/ImageSlice";
import openImageFile from "../fileio/openImageFile";

function SimpleImage(): React.ReactElement {
  const [renderer, SetRenderer] = useState();
  const [renderWindow, SetRenderWindow] = useState();

  const container = React.createRef<HTMLDivElement>();

  useEffect(() => {
    const newGenericRenderWindow = vtkGenericRenderWindow.newInstance({
      background: [0, 0, 0]
    });
    newGenericRenderWindow.setContainer(container.current);

    const rderer = newGenericRenderWindow.getRenderer();
    const rderWindow = newGenericRenderWindow.getRenderWindow();

    rderer.resetCamera();
    rderWindow.render();

    SetRenderer(rderer);
    SetRenderWindow(rderWindow);
  }, []);

  const getImage = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { files } = e.target;
    if (files) {
      openImageFile(files[0])
        .then(data => {
          console.log("create actor");
          const mapper = vtkImageMapper.newInstance();
          mapper.setSliceAtFocalPoint(true);
          mapper.setInputData(null);
          mapper.setInputData(data);

          const actor = vtkImageSlice.newInstance();
          actor.getProperty().setColorWindow(255);
          actor.getProperty().setColorLevel(127);

          actor.setMapper(mapper);
          if (renderer !== null) {
            renderer.removeAllActors();
            renderer.addActor(actor);
            renderer.resetCamera();
            renderWindow.render();
          }
        })
        .catch(error => {
          console.log(`Failed to open file - ${error.message}`);
        });
    }
  };

  const style: React.CSSProperties = {
    width: "600px",
    height: "600px",
    position: "relative"
  };

  return (
    <div style={style}>
      <div>
        <h4>Simple Image</h4>
        <p>
          Select File:
          <input type="file" accept="image/*" onChange={getImage} />
        </p>
        <div ref={container} style={style} />
      </div>
    </div>
  );
}

export default SimpleImage;
