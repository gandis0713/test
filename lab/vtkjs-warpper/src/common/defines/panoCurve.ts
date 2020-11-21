import { Vector3 } from '@ewoosoft/es-common-types';

export interface IPanoCurve {
  interval: number; // section view interval
  thickness: number; // section view thickness
  width: number; // curve width for pano
  height: number; // curve height for pano
  sectionCenter: number;
  length: number;
  data: Vector3[];
  normal: {
    right: Vector3[];
    forward: Vector3[];
  };
}
