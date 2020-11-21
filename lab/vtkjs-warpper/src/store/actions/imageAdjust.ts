import { typedAction, TypedAction } from './common/typedAction';

// Action Types
export const IMAGEADJUST = 'IMAGEADJUST';
export const CHANGE_VR_OPACITY = `${IMAGEADJUST}/CHANGE_VR_OPACITY`;
export const CHANGE_VR_BRIGHTNESS = `${IMAGEADJUST}/CHANGE_VR_BRIGHTNESS`;
export const CHANGE_VR_CONTRAST = `${IMAGEADJUST}/CHANGE_VR_CONTRAST`;
export const CHANGE_WINDOWING_WIDTH = `${IMAGEADJUST}/CHANGE_WINDOWING_WIDTH`;
export const CHANGE_WINDOWING_LEVEL = `${IMAGEADJUST}/CHANGE_WINDOWING_LEVEL`;
export const SET_WINDOWING_RANGE = `${IMAGEADJUST}/SET_WINDOWING_RANGE`;
export const TOGGLE_FILTERING_SMOOTH = `${IMAGEADJUST}/TOGGLE_FILTERING_SMOOTH`;
export const TOGGLE_FILTERING_SHARPEN = `${IMAGEADJUST}/TOGGLE_FILTERING_SHARPEN`;
export const TOGGLE_FILTERING_MAXSHARPEN = `${IMAGEADJUST}/TOGGLE_FILTERING_MAXSHARPEN`;
export const TOGGLE_FILTERING_INVERSE = `${IMAGEADJUST}/TOGGLE_FILTERING_INVERSE`;
export const TOGGLE_FILTERING_MIP = `${IMAGEADJUST}/TOGGLE_FILTERING_MIP`;
export const SET_FILTERING_SMOOTH = `${IMAGEADJUST}/SET_FILTERING_SMOOTH`;
export const SET_FILTERING_SHARPEN = `${IMAGEADJUST}/SET_FILTERING_SHARPEN`;
export const SET_FILTERING_MAXSHARPEN = `${IMAGEADJUST}/SET_FILTERING_MAXSHARPEN`;
export const SET_FILTERING_INVERSE = `${IMAGEADJUST}/SET_FILTERING_INVERSE`;
export const SET_FILTERING_MIP = `${IMAGEADJUST}/SET_FILTERING_MIP`;
export const RESET_IMAGE_ADJUST = `${IMAGEADJUST}/RESET_IMAGE_ADJUST`;
export const RESET_WINDOWING = `${IMAGEADJUST}/RESET_WINDOWING`;
export const RESET_FILTERING = `${IMAGEADJUST}/RESET_FILTERING`;

// Actions
export const changeVROpacityAction = (opacity: number): TypedAction => {
  return typedAction(CHANGE_VR_OPACITY, opacity);
};

export const changeVRBrightnessAction = (brightness: number): TypedAction => {
  return typedAction(CHANGE_VR_BRIGHTNESS, brightness);
};

export const changeVRContrastAction = (contrast: number): TypedAction => {
  return typedAction(CHANGE_VR_CONTRAST, contrast);
};

export const changeWindowingWidthAction = (width: number): TypedAction => {
  return typedAction(CHANGE_WINDOWING_WIDTH, width);
};

export const changeWindowingLevelAction = (level: number): TypedAction => {
  return typedAction(CHANGE_WINDOWING_LEVEL, level);
};

export const setWindowingRangeAction = (minValue: number, maxValue: number): TypedAction => {
  return typedAction(SET_WINDOWING_RANGE, { min: minValue, max: maxValue });
};

export const toggleFilteringSmoothAction = (): TypedAction => {
  return typedAction(TOGGLE_FILTERING_SMOOTH);
};

export const toggleFilteringSharpenAction = (): TypedAction => {
  return typedAction(TOGGLE_FILTERING_SHARPEN);
};

export const toggleFilteringMaxSharpenAction = (): TypedAction => {
  return typedAction(TOGGLE_FILTERING_MAXSHARPEN);
};

export const toggleFilteringInverseAction = (): TypedAction => {
  return typedAction(TOGGLE_FILTERING_INVERSE);
};

export const toggleFilteringMIPAction = (): TypedAction => {
  return typedAction(TOGGLE_FILTERING_MIP);
};

export const setFilteringSmoothAction = (on: boolean): TypedAction => {
  return typedAction(SET_FILTERING_SMOOTH, on);
};

export const setFilteringSharpenAction = (on: boolean): TypedAction => {
  return typedAction(SET_FILTERING_SHARPEN, on);
};

export const setFilteringMaxSharpenAction = (on: boolean): TypedAction => {
  return typedAction(SET_FILTERING_MAXSHARPEN, on);
};

export const setFilteringInverseAction = (on: boolean): TypedAction => {
  return typedAction(SET_FILTERING_INVERSE, on);
};

export const setFilteringMIPAction = (on: boolean): TypedAction => {
  return typedAction(SET_FILTERING_MIP, on);
};

export const resetImageAdjustAction = (): TypedAction => {
  return typedAction(RESET_IMAGE_ADJUST);
};

export const resetWindowingAction = (): TypedAction => {
  return typedAction(RESET_WINDOWING);
};

export const resetFilteringAction = (): TypedAction => {
  return typedAction(RESET_FILTERING);
};
