export interface IVRImageAdjustProperty {
  brightness: number;
  contrast: number;
  opacity: number;
}

export interface ISliceImageAdjustProperty {
  windowLevel: number;
  windowWidth: number;
  smooth: boolean;
  sharpen: boolean;
  maxSharpen: boolean;
  inverse: boolean;
  mip: boolean;
}

export interface IWindowingRangeProperty {
  windowingWidthRange: { min: number; max: number };
  windowingLevelRange: { min: number; max: number };
}

export enum ViewFilteringMode {
  eFilterNone = 0,
  eFilterSmooth = 1,
  eFilterSharpen = 2,
  eFilterMaxSharpen = 2,
}

export enum SliceViewRenderMode {
  eAverage = 'average',
  eMIP = 'mip',
}
