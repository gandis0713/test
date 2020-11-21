import { IWindowingRangeProperty } from './defines/imageAdjust';

export enum ActionType {
  None = 'None',
  Select = 'Select',
  Zooming = 'Zooming',
  Panning = 'Panning',
  Length = 'Length',
  Implant = 'Implant',
  Crown = 'Crown',
  // TODO
}

export enum ActionState {
  Start = 'start',
  Cancel = 'cancel',
  Finish = 'finish',
}

export interface IViewportApis {
  changeAction: (type: ActionType) => void; // TODO: props or api
}

export interface IImageAdjustProperty {
  windowLevel: number;
  windowWidth: number;
  smooth: boolean;
  sharpen: boolean;
  maxSharpen: boolean;
  inverse: boolean;
  mip: boolean;
}

export interface IBaseActionProperty {
  actionType: ActionType;
  onStart?: (apis: IViewportApis) => void;
  onFinish?: () => void;
  onError?: (errorCode: number) => void;
}

export type IModelViewActionProperty = IBaseActionProperty;

export interface IActionProperty extends IBaseActionProperty {
  onViewerActivated: (
    imageAdjust: IImageAdjustProperty,
    windowingRange: IWindowingRangeProperty
  ) => void;
}

export enum CTViewerLayout {
  LayoutMPR = 'MPR',
  Layout3DPAN = '3DPAN',
  LayoutOblique = 'Oblique',
}
