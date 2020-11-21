import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkMapper from 'vtk.js/Sources/Rendering/Core/Mapper';
import vtkPolyData from 'vtk.js/Sources/Common/DataModel/PolyData';
import AbstractActor from './AbstractActor';
import { mat4 } from 'gl-matrix';

class ModelActor3D extends AbstractActor {
  protected modelData: vtkPolyData;

  protected modelActor: vtkActor;

  protected modelMapper: vtkMapper;

  static getClassType(): string {
    return 'ModelActor3D';
  }

  constructor() {
    super();
    this.actorType = 'ModelActor3D';
    this.initializeActor();
  }

  setModelData(data: vtkPolyData): void {
    this.modelData = data;

    this.modelMapper.setInputData(this.modelData);
    console.log(`volOrientation${this.modelActor.getMatrix()}`);
  }

  getActor(): vtkActor {
    return this.modelActor;
  }

  setActor(actor: vtkActor): void {
    this.modelActor = actor;
  }

  setVisibility(show: boolean) {
    this.modelActor.setVisibility(show);
  }

  setPosition(x: number, y: number, z: number): void {
    this.modelActor.setPosition(x, y, z);
  }

  setOpacity(opacity: number): void {
    this.modelActor.getProperty().setOpacity(opacity);
  }

  setColor(r: number, g: number, b: number): void {
    this.modelActor.getProperty().setColor(r, g, b);
  }

  setRotationX(value: number) {
    this.modelActor.rotateX(value);
  }

  setUserMatrix(mat: number[]) {
    this.modelActor.setUserMatrix(mat);
  }

  getMatrix() {
    if (this.modelActor) {
      return this.modelActor.getMatrix();
    } else {
      return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    }
  }

  initializeActor(): void {
    this.modelActor = vtkActor.newInstance();
    this.modelMapper = vtkMapper.newInstance({ scalarVisibility: false });
    this.modelActor.setMapper(this.modelMapper);
    this.modelActor.onModified(this.onModified);

    this.modelActor.getProperty().setColor(0.16, 0.8, 0.43);
    console.log(`position${this.modelActor.getPosition()}`);
  }
}

export default ModelActor3D;
