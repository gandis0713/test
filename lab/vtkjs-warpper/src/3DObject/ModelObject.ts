import vtk2DOutlineActor from '../customVtkjs/Rendering/Core/ES2DOutlineActor';
import vtk2DOutlineMapper from '../customVtkjs/Rendering/Core/ES2DOutlineMapper';
import AbstractObject, { Object3DType } from './AbstractObject';

class ModelObject extends AbstractObject {
  constructor() {
    super();
    this.type = Object3DType.eModel;
    this.initialize();
  }

  protected initialize(): void {
    // eslint-disable-next-line import/no-named-as-default-member
    this.prop3D = vtk2DOutlineActor.newInstance();
    // eslint-disable-next-line import/no-named-as-default-member
    this.prop3D.setMapper(vtk2DOutlineMapper.newInstance({ scalarVisibility: false }));
    this.prop3D.setUserMatrix([1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
    this.prop3D.onModified(this.onModified);
  }
}

export default ModelObject;
