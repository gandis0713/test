import { vec3 } from 'gl-matrix';

export interface IPlaneInfo {
  position: vec3;
  normal: vec3;
  up: vec3;
}

export interface IRotation {
  rotAxis: vec3;
  radian: number;
}
