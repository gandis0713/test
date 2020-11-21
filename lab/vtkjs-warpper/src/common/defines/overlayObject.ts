import { vec2, vec3 } from 'gl-matrix';
import { IPlaneInfo } from './core';
import { IObjectInfo, ObjectType, ObjectSharingType } from './object';

export interface ITextBoxInfo {
  boxID: string;
  text: string;
  offSet: vec2;
}

export interface IOverlayInfo extends IObjectInfo {
  color: string;
  pointList: vec3[];
  plane: IPlaneInfo;
  textBoxes: ITextBoxInfo[];
}

export function createInitialOveralyObject(
  id: string,
  objectType: ObjectType,
  sharingType: ObjectSharingType
): IOverlayInfo {
  const overlayObject: IOverlayInfo = {
    id,
    visible: true,
    type: objectType,
    sharingType,
    color: '#ffff00',
    pointList: [],
    plane: {
      position: [0, 0, 0],
      normal: [0, 0, 1],
      up: [0, 1, 0],
    },
    textBoxes: [],
    widgetFactory: null,
  };

  return overlayObject;
}
