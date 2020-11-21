import { IImplantInfo } from '@ewoosoft/es-common-types';
import { vec3 } from 'gl-matrix';
import { IRotation } from './core';
import { IObjectInfo, ObjectType, ObjectSharingType } from './object';

export enum ToothDirection {
  Unknown,
  eUpperTooth,
  eLowerTooth,
}

export interface IModelObjectInfo extends IObjectInfo {
  color: string;
  position: vec3;
  rotation: IRotation;
  filename: string;
}

export interface IImplantSetInfo extends IObjectInfo {
  toothID: string;
  toothDirection: ToothDirection;
  position: vec3;
  rotation: IRotation;
  useImplant: boolean;
  useCrown: boolean;
  useGuide: boolean;
  usePath: boolean;
  implantInfo: IImplantInfo;
  crownInfo: IModelObjectInfo | undefined;
  useLongAxis: boolean;
  longAxisLength: number;
}

export function createInitialImplantSet(
  id: string,
  implantInfo: IImplantInfo,
  type: ObjectType,
  sharingType: ObjectSharingType
): IImplantSetInfo {
  const implantSet: IImplantSetInfo = {
    id,
    visible: true,
    type,
    sharingType,
    toothID: '17', // need to be generated
    toothDirection: ToothDirection.eUpperTooth, // need to be generated
    position: [0, 0, 0],
    rotation: {
      rotAxis: [0, 0, 1],
      radian: 0,
    },
    useImplant: true,
    useCrown: false,
    useGuide: false,
    usePath: false,
    implantInfo,
    crownInfo: undefined,
    useLongAxis: false,
    longAxisLength: 0,
    widgetFactory: null,
  };

  return implantSet;
}

export interface ICanalInfo extends IObjectInfo {
  canalPointList: vec3[];
  diamenter: number;
  color: string;
}
