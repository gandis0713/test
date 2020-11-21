import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkImageSlice from 'vtk.js/Sources/Rendering/Core/ImageSlice';
import vtkPolyData from 'vtk.js/Sources/Common/DataModel/PolyData';
import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';
import { mat4 } from 'gl-matrix';

export enum Object3DType {
  eNone = '',
  eModel = 'model',
  eVolume = 'volume',
  eVolume3D = 'volume3D',
  eVolume2D = 'volume2D',
  eVolume3DPAN = 'volumePAN',
}

type Prop3D = vtkActor | vtkVolume | vtkImageSlice;
type DataSet = vtkPolyData | vtkImageData;

abstract class AbstractObject3D {
  protected type: Object3DType;

  protected children: AbstractObject3D[];

  protected prop3D: Prop3D;

  constructor() {
    this.type = Object3DType.eNone;
    this.children = [];
    this.onModified = this.onModified.bind(this);
  }

  public setProp3D(prop3D: Prop3D): void {
    this.prop3D = prop3D;
    this.prop3D.onModified(this.onModified);
  }

  public getProp3D(): Prop3D {
    return this.prop3D;
  }

  public addChild(child: AbstractObject3D): void {
    if (this.type !== child.type) {
      return;
    }

    const idx = this.children.indexOf(child);
    if (idx === -1) {
      const userMatrix = mat4.create();
      mat4.transpose(userMatrix, this.getMatrix());
      child.setUserMatrix(userMatrix);
      this.children.push(child);
    }
  }

  public removeChild(child: AbstractObject3D): void {
    if (this.type !== child.type) {
      return;
    }

    const idx = this.children.indexOf(child);
    if (idx > -1) {
      this.children.splice(idx, 1);
    }
  }

  public setInputData(data: DataSet): void {
    this.prop3D.getMapper().setInputData(data);
  }

  public getBounds(): [number, number, number, number, number, number] {
    return this.prop3D.getMapper().getBounds();
  }

  public setUserMatrix(matrix: mat4): void {
    if (this.prop3D) {
      this.prop3D.setUserMatrix(matrix);
    }
    this.setUserMatrixToChild();
  }

  private setUserMatrixToChild(): void {
    const userMatrix = mat4.create();
    mat4.transpose(userMatrix, this.getMatrix());
    this.children.forEach((child) => {
      child.setUserMatrix(userMatrix);
    });
  }

  public getMatrix(): mat4 {
    if (this.prop3D) {
      return this.prop3D.getMatrix();
    }
    return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
  }

  public getType(): Object3DType {
    return this.type;
  }

  public onModified(): void {
    this.setUserMatrixToChild();
  }
}

export default AbstractObject3D;
