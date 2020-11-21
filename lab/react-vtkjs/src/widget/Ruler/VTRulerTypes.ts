/*
    Copyright (c) Ewoosoft Co., Ltd.
    
    All rights reserved.
*/
import * as vtkMath from 'vtk.js/Sources/Common/Core/Math';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';

export type VTRulerGraduation = {
  isOn: boolean;
  length: number;
  minSiblingDist: number;
  maxSiblingDist: number;
  isNumberOn: boolean;
  isNumberRulerRangeOnly: boolean;
  numberPosition: 'inside' | 'outside' | 'none';
  numberMargin: number;
  isUnitOn: boolean;
  unit: string;
};

export type VTRulerState = {
  position: 'left' | 'right' | 'top' | 'bottom'; // defualut = right
  graduationPosition: 'inside' | 'outside';
  lengthPerClient: number;
  trimLength: 'none' | 'short' | 'middle' | 'long';
  positionMargin: number;
  startMargin: number;
  endMargin: number;

  isNumberOn: boolean;
  numberPosition: 'start' | 'end'; // default = end
  numberMargin: number;
  numberSize: number;
  numberColor: string;
  rulerColor: string;
  rulerThickness: number;
  isUnitOn: boolean;
  unit: string;

  minThreshouldGraduation: number;
  maxThreshouldGraduation: number;

  shortGraduation: VTRulerGraduation;
  middleGraduation: VTRulerGraduation;
  longGraduation: VTRulerGraduation;
};

export type VTParentViewState = {
  x: number; // pixel
  y: number; // pixel
  width: number; // pixel
  height: number; // pixel
  realWidth: number; // mili-meter, total width size
  realHeight: number; // mili-meterm, total heighth size
  pixelSizeXmm: number; // mili-meter, pixel size of screen or print page
  pixelSizeYmm: number; // mili-meter, pixel size of screen or print page
};

export function makeParentViewState(
  clientRect: DOMRect,
  glWindow: vtkOpenGLRenderWindow,
  renderer: vtkRenderer
): VTParentViewState {
  const parentState = {} as VTParentViewState;

  parentState.x = clientRect.x;
  parentState.y = clientRect.y;

  const pointUpperLeft = glWindow.displayToWorld(clientRect.x, clientRect.y, 0, renderer);
  const pointUpperRight = glWindow.displayToWorld(
    clientRect.x + clientRect.width - 1,
    clientRect.y,
    0,
    renderer
  );
  const pointLowerLeft = glWindow.displayToWorld(
    clientRect.x,
    clientRect.y + clientRect.height - 1,
    0,
    renderer
  );

  let realLengthX = vtkMath.distance2BetweenPoints(pointUpperLeft, pointUpperRight);
  let realLengthY = vtkMath.distance2BetweenPoints(pointUpperLeft, pointLowerLeft);

  realLengthX = Math.sqrt(realLengthX);
  realLengthY = Math.sqrt(realLengthY);

  parentState.width = clientRect.width;
  parentState.height = clientRect.height;
  parentState.realWidth = realLengthX;
  parentState.realHeight = realLengthY;
  parentState.pixelSizeXmm = 0.297; // TODO : @Draco, Support DPI.
  parentState.pixelSizeYmm = 0.297;

  return parentState;
}

export function makeCommonRulerState(position: 'left' | 'right' | 'top' | 'bottom'): VTRulerState {
  const rulerState = {} as VTRulerState;

  rulerState.position = position;
  rulerState.lengthPerClient = 0.7;
  rulerState.trimLength = 'long';
  rulerState.positionMargin = 1;
  rulerState.startMargin = 0; // for client area length, applied after trimming.
  rulerState.endMargin = 0; // for client area length, applied after trimming.
  rulerState.isNumberOn = true;
  rulerState.numberPosition = 'end';
  rulerState.numberMargin = 5;
  rulerState.numberSize = 8;
  rulerState.numberColor = '#00ff00';
  rulerState.rulerColor = '#ffff00';
  rulerState.rulerThickness = 1;
  rulerState.isUnitOn = true;
  rulerState.unit = 'mm'; // TODO : @Draco, Force unit by setting.
  rulerState.graduationPosition = 'inside';

  rulerState.minThreshouldGraduation = 4;
  rulerState.maxThreshouldGraduation = 40;

  rulerState.shortGraduation = {
    isOn: true,
    length: 5,
    minSiblingDist: 1,
    maxSiblingDist: 0,
    isNumberOn: false,
    isNumberRulerRangeOnly: true,
    numberPosition: 'none',
    numberMargin: 5,
    isUnitOn: false,
    unit: ''
  };

  rulerState.middleGraduation = {
    isOn: true,
    length: 10,
    minSiblingDist: 2,
    maxSiblingDist: 0,
    isNumberOn: false,
    isNumberRulerRangeOnly: true,
    numberPosition: 'none',
    numberMargin: 5,
    isUnitOn: false,
    unit: ''
  };

  rulerState.longGraduation = {
    isOn: true,
    length: 15,
    minSiblingDist: 0,
    maxSiblingDist: 0,
    isNumberOn: false,
    isNumberRulerRangeOnly: true,
    numberPosition: 'none',
    numberMargin: 5,
    isUnitOn: false,
    unit: '' // TODO : @Draco, Force unit by setting.
  };

  return rulerState;
}
