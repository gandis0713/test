import { vec3 } from 'gl-matrix';

export type ImplantList = {
  implant: Implant[];
};

export type Implant = {
  file: string;
  position: vec3;
  rotAxis: vec3;
  rotAngle: number;
  crown: Crown | null;
};

export type Crown = {
  file: string;
  position: vec3;
  rotAxis: vec3;
  rotAngle: number;
  scale: vec3;
};

const crown1: Crown = {
  file: '/testdata/stl/Crown_23.stl',
  position: [0, 0, 0],
  rotAxis: [1, 0, 0],
  rotAngle: 0,
  scale: [1, 1, 1]
};

const implant1: Implant = {
  file: '/testdata/stl/Implant01.stl',
  position: [0, 0, 0],
  rotAxis: [1, 0, 0],
  rotAngle: 0,
  crown: crown1
};

const implantList: Implant[] = [implant1];

export default implantList;
