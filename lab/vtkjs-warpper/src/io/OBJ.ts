import vtkMTLReader from 'vtk.js/Sources/IO/Misc/MTLReader';
import vtkOBJReader from 'vtk.js/Sources/IO/Misc/OBJReader';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';

const LoadOBJByUrl = (objUrl: string, mtlUrl: string): vtkActor => {
  return new Promise((resolve, reject) => {
    const reader = vtkOBJReader.newInstance({ splitMode: 'usemtl' });
    const materialsReader = vtkMTLReader.newInstance();

    materialsReader
      .setUrl(mtlUrl)
      .then(() => {
        reader
          .setUrl(objUrl)
          .then(() => {
            const actor = vtkActor.newInstance();
            const size = reader.getNumberOfOutputPorts();
            for (let index = 0; index < size; index += 1) {
              const polydata = reader.getOutputData(index);
              const { name } = polydata.get('name');
              const mapper = vtkMapper.newInstance();

              actor.setMapper(mapper);
              mapper.setInputData(polydata);

              materialsReader.applyMaterialToActor(name, actor);
            }
            resolve(actor);
          })
          .catch(() => {
            reject(new Error('Failed to open obj file.'));
          });
      })
      .catch(() => {
        reject(new Error('Failed to open mtl file.'));
      });
  });
};

const LoadOBJ = (obj: string, mtl: string): vtkActor => {
  return new Promise((resolve, reject) => {
    LoadOBJByUrl(obj, mtl)
      .then((actor) => {
        resolve(actor);
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export default LoadOBJ;
