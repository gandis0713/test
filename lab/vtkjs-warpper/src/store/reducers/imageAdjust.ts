import * as Actions from '../actions/imageAdjust';
import { TypedAction } from '../actions/common/typedAction';
import {
  IVRImageAdjustProperty,
  ISliceImageAdjustProperty,
  IWindowingRangeProperty,
} from '../../common/defines/imageAdjust';

export interface IImageAdjustState {
  vrImageAdjust: IVRImageAdjustProperty;
  sliceImageAdjust: ISliceImageAdjustProperty;
  windowingRange: IWindowingRangeProperty;
}

export const initialState: IImageAdjustState = {
  vrImageAdjust: {
    opacity: 1,
    brightness: 0,
    contrast: 0,
  },
  sliceImageAdjust: {
    windowLevel: 1500,
    windowWidth: 5500,
    smooth: false,
    sharpen: false,
    maxSharpen: false,
    inverse: false,
    mip: false,
  },
  windowingRange: {
    windowingWidthRange: { min: 0, max: 5500 },
    windowingLevelRange: { min: -1250, max: 4250 },
  },
};

export function imageAdjustReducer(
  state: IImageAdjustState = initialState,
  action: TypedAction
): IImageAdjustState {
  switch (action.type) {
    case Actions.CHANGE_VR_OPACITY:
      return { ...state, vrImageAdjust: { ...state.vrImageAdjust, opacity: action.payload } };
    case Actions.CHANGE_VR_BRIGHTNESS:
      return { ...state, vrImageAdjust: { ...state.vrImageAdjust, brightness: action.payload } };
    case Actions.CHANGE_VR_CONTRAST:
      return { ...state, vrImageAdjust: { ...state.vrImageAdjust, contrast: action.payload } };
    case Actions.CHANGE_WINDOWING_WIDTH:
      return {
        ...state,
        sliceImageAdjust: { ...state.sliceImageAdjust, windowWidth: action.payload },
      };
    case Actions.CHANGE_WINDOWING_LEVEL:
      return {
        ...state,
        sliceImageAdjust: { ...state.sliceImageAdjust, windowLevel: action.payload },
      };
    case Actions.SET_WINDOWING_RANGE: {
      const newWidth = action.payload.max - action.payload.min;
      const newLevel = action.payload.min + Math.ceil(newWidth / 2);
      return {
        ...state,
        windowingRange: {
          windowingLevelRange: { min: action.payload.min, max: action.payload.max },
          windowingWidthRange: { min: 0, max: newWidth },
        },
        sliceImageAdjust: {
          ...state.sliceImageAdjust,
          windowWidth: newWidth,
          windowLevel: newLevel,
        },
      };
    }
    case Actions.TOGGLE_FILTERING_SMOOTH:
      return {
        ...state,
        sliceImageAdjust: {
          ...state.sliceImageAdjust,
          smooth: !state.sliceImageAdjust.smooth,
          sharpen: !state.sliceImageAdjust.smooth ? false : state.sliceImageAdjust.sharpen,
          maxSharpen: !state.sliceImageAdjust.smooth ? false : state.sliceImageAdjust.maxSharpen,
        },
      };
    case Actions.TOGGLE_FILTERING_SHARPEN:
      return {
        ...state,
        sliceImageAdjust: {
          ...state.sliceImageAdjust,
          sharpen: !state.sliceImageAdjust.sharpen,
          smooth: !state.sliceImageAdjust.sharpen ? false : state.sliceImageAdjust.smooth,
          maxSharpen: !state.sliceImageAdjust.sharpen ? false : state.sliceImageAdjust.maxSharpen,
        },
      };
    case Actions.TOGGLE_FILTERING_MAXSHARPEN:
      return {
        ...state,
        sliceImageAdjust: {
          ...state.sliceImageAdjust,
          maxSharpen: !state.sliceImageAdjust.maxSharpen,
          smooth: !state.sliceImageAdjust.maxSharpen ? false : state.sliceImageAdjust.smooth,
          sharpen: !state.sliceImageAdjust.maxSharpen ? false : state.sliceImageAdjust.sharpen,
        },
      };
    case Actions.TOGGLE_FILTERING_INVERSE:
      return {
        ...state,
        sliceImageAdjust: { ...state.sliceImageAdjust, inverse: !state.sliceImageAdjust.inverse },
      };
    case Actions.TOGGLE_FILTERING_MIP:
      return {
        ...state,
        sliceImageAdjust: { ...state.sliceImageAdjust, mip: !state.sliceImageAdjust.mip },
      };
    case Actions.SET_FILTERING_SMOOTH:
      return {
        ...state,
        sliceImageAdjust: { ...state.sliceImageAdjust, smooth: action.payload },
      };
    case Actions.SET_FILTERING_SHARPEN:
      return {
        ...state,
        sliceImageAdjust: { ...state.sliceImageAdjust, sharpen: action.payload },
      };
    case Actions.SET_FILTERING_MAXSHARPEN:
      return {
        ...state,
        sliceImageAdjust: { ...state.sliceImageAdjust, maxSharpen: action.payload },
      };
    case Actions.SET_FILTERING_INVERSE:
      return {
        ...state,
        sliceImageAdjust: { ...state.sliceImageAdjust, inverse: action.payload },
      };
    case Actions.SET_FILTERING_MIP:
      return {
        ...state,
        sliceImageAdjust: { ...state.sliceImageAdjust, mip: action.payload },
      };
    case Actions.RESET_IMAGE_ADJUST: {
      const newWidth = state.windowingRange.windowingWidthRange.max;
      const newLevel =
        state.windowingRange.windowingLevelRange.min +
        Math.ceil(state.windowingRange.windowingWidthRange.max / 2);
      return {
        ...state,
        vrImageAdjust: {
          opacity: 1,
          brightness: 0,
          contrast: 0,
        },
        sliceImageAdjust: {
          windowLevel: newLevel,
          windowWidth: newWidth,
          smooth: false,
          sharpen: false,
          maxSharpen: false,
          inverse: false,
          mip: false,
        },
      };
    }
    case Actions.RESET_WINDOWING: {
      const newWidth = state.windowingRange.windowingWidthRange.max;
      const newLevel =
        state.windowingRange.windowingLevelRange.min +
        Math.ceil(state.windowingRange.windowingWidthRange.max / 2);
      return {
        ...state,
        sliceImageAdjust: {
          ...state.sliceImageAdjust,
          windowWidth: newWidth,
          windowLevel: newLevel,
        },
      };
    }
    case Actions.RESET_FILTERING:
      return {
        ...state,
        sliceImageAdjust: {
          ...state.sliceImageAdjust,
          smooth: false,
          sharpen: false,
          maxSharpen: false,
          inverse: false,
          mip: false,
        },
      };
    default:
      return state;
  }
}
