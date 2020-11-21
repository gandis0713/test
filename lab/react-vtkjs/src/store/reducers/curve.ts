import { vec3 } from 'gl-matrix';

export type PanoCurve = {
  interval: number; // section view interval
  thickness: number; // section view thickness
  width: number; // curve width for pano
  height: number; // curve height for pano
  sectionCenter: number;
  length: number;
  data: vec3[];
  normal: {
    right: vec3[];
    forward: vec3[];
  };
};

const panoCurveState: PanoCurve = {
  interval: 1.0,
  thickness: 1.0,
  width: 50.0,
  height: 40.0,
  sectionCenter: 0,
  length: 0,
  data: [],
  normal: {
    right: [],
    forward: []
  }
};

export default panoCurveState;
