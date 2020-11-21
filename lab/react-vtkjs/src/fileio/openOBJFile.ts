import vtkMTLReader from 'vtk.js/Sources/IO/Misc/MTLReader';
import vtkOBJReader from 'vtk.js/Sources/IO/Misc/OBJReader';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkPolyData from 'vtk.js/Sources/Common/DataModel/PolyData';

export interface OBJScene {
  name: string;
  polydata: vtkPolyData;
  mapper: vtkMapper;
  actor: vtkActor;
}

export const openOBJByUrl = (objFileUrl: string, mtlFileUrl: string): Promise<OBJScene[]> => {
  console.log(`file open - ${objFileUrl}`);
  return new Promise((resolve, reject) => {
    const reader = vtkOBJReader.newInstance({ splitMode: 'usemtl' });
    const materialsReader = vtkMTLReader.newInstance();
    const scene: OBJScene[] = [];

    materialsReader
      .setUrl(mtlFileUrl)
      .then(() => {
        reader
          .setUrl(objFileUrl)
          .then(() => {
            const size = reader.getNumberOfOutputPorts();
            for (let i = 0; i < size; i += 1) {
              const polydata = reader.getOutputData(i);
              const { name } = polydata.get('name');
              const mapper = vtkMapper.newInstance();
              const actor = vtkActor.newInstance();

              actor.setMapper(mapper);
              mapper.setInputData(polydata);

              materialsReader.applyMaterialToActor(name, actor);
              scene.push({ name, polydata, mapper, actor });
            }
            resolve(scene);
          })
          .catch(() => {
            reject(new Error('Failed to open obj file'));
          });
      })
      .catch(() => {
        reject(new Error('Failed to open mtl file'));
      });
  });
};
