import ModelActor3D from './ModelActor3D';
import { mat4 } from 'gl-matrix';

class CrownActor extends ModelActor3D {
  constructor() {
    super();
    this.actorType = 'CrownActor';
  }

  static getClassType(): string {
    return 'CrownActor';
  }
}

export default CrownActor;
