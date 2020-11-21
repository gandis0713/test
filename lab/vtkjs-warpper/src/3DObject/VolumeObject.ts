import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';
import AbstractObject, { Object3DType } from './AbstractObject';

class VolumeObject extends AbstractObject {
  constructor() {
    super();
    this.type = Object3DType.eVolume;
    this.initialize();
  }

  protected initialize(): void {
    this.prop3D = vtkVolume.newInstance();
    const mapper = vtkVolumeMapper.newInstance();
    mapper.setSampleDistance(1);
    this.prop3D.setMapper(mapper);

    this.prop3D.onModified(this.onModified);
  }
}

export default VolumeObject;
