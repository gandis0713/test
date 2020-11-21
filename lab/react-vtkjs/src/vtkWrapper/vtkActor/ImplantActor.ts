import ModelActor3D from './ModelActor3D';
import { mat4 } from 'gl-matrix';

class ImplantActor extends ModelActor3D {
  constructor() {
    super();
    this.actorType = 'ImplantActor';
  }

  static getClassType(): string {
    return 'ImplantActor';
  }
}

export default ImplantActor;
