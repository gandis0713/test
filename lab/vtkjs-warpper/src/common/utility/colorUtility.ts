/* eslint-disable import/prefer-default-export */
import { ViewType } from '../defines';

export function getViewTitleFontNormalColor(viewType: ViewType): string {
  switch (viewType) {
    case ViewType.Volume2DAxial:
    case ViewType.Volume2DScout:
      return '#309de8';
    case ViewType.Volume2DCoronal:
    case ViewType.Volume3DPAN:
      return '#b59700';
    case ViewType.Volume2DSaggital:
    case ViewType.Volume2DSection:
      return '#cc6652';
    case ViewType.Volume2DOblique:
    case ViewType.Volume3D:
    case ViewType.Model:
      return '#36b26c';
    case ViewType.None:
    default:
      return '#ffffff';
  }
}

export function getViewTitleFontHoverColor(viewType: ViewType): string {
  switch (viewType) {
    case ViewType.Volume2DAxial:
    case ViewType.Volume2DCoronal:
    case ViewType.Volume3DPAN:
    case ViewType.Volume2DSaggital:
    case ViewType.Volume2DSection:
    case ViewType.Volume2DOblique:
    case ViewType.Volume2DScout:
    case ViewType.Volume3D:
    case ViewType.Model:
    case ViewType.None:
    default:
      return '#ffffff';
  }
}

export function getViewFrameHoverColor(viewType: ViewType): string {
  switch (viewType) {
    case ViewType.Volume2DAxial:
    case ViewType.Volume2DScout:
      return '#0f5a97';
    case ViewType.Volume2DCoronal:
    case ViewType.Volume3DPAN:
      return '#8c7e38';
    case ViewType.Volume2DSaggital:
    case ViewType.Volume2DSection:
      return '#8c3929';
    case ViewType.Volume2DOblique:
    case ViewType.Volume3D:
    case ViewType.Model:
      return '#1f663e';
    case ViewType.None:
    default:
      return '#333333';
  }
}

export function getViewFrameNormalColor(viewType: ViewType): string {
  switch (viewType) {
    case ViewType.Volume2DAxial:
    case ViewType.Volume2DCoronal:
    case ViewType.Volume3DPAN:
    case ViewType.Volume2DSaggital:
    case ViewType.Volume2DSection:
    case ViewType.Volume2DOblique:
    case ViewType.Volume2DScout:
    case ViewType.Volume3D:
    case ViewType.Model:
    case ViewType.None:
    default:
      return '#333333';
  }
}
