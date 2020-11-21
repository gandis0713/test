import { mat4 } from 'gl-matrix';

abstract class AbstractActor {
  protected actorType: string;
  protected children: AbstractActor[];

  constructor() {
    this.actorType = 'AbsctractActor';
    this.children = [];

    this.onModified = this.onModified.bind(this);
  }

  addChild(child: AbstractActor) {
    console.log('addChild this.getMatrix() : ', this.getMatrix());
    const tansposedMatrix = mat4.create();
    mat4.transpose(tansposedMatrix, this.getMatrix());
    child.setUserMatrix(tansposedMatrix);

    this.children.push(child);
  }

  abstract setUserMatrix(matrix: number[]);
  abstract getMatrix(): number[];

  onModified() {
    this.children.forEach(child => {
      console.log('onModified this.getMatrix() : ', this.getMatrix());
      const tansposedMatrix = mat4.create();
      mat4.transpose(tansposedMatrix, this.getMatrix());
      child.setUserMatrix(tansposedMatrix);
    });
  }

  getActorType(): string {
    return this.actorType;
  }

  static getClassType(): string {
    return 'AbsctractActor';
  }

  abstract setActor(actor);

  abstract getActor();
}

export default AbstractActor;
