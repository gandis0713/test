import React from 'react';
import { ISize, IPoint } from '@ewoosoft/es-common-types';
import { IScalebarProperty } from '@ewoosoft/es-scalebar';
import { makeDefault2DScalebarProperties } from '../../common/defines/scalebarPredefines';
import { IActionProperty } from '../../common/types';
import Volume3DView from '../view/Volume3DView';
import VolumePanView from '../view/VolumePanView';
import VolumeObliqueView from '../view/VolumeObliqueView';
import VolumeScoutView from '../view/VolumeScoutView';
import { IVolumeStates, IVolumeState } from '../../store/reducers/volume';
import { RootState } from '../../store/rootReducer';
import { ViewType } from '../../common/defines';
import VolumeSectionView from '../view/VolumeSectionView';
import VolumeMPRView from '../view/VolumeMPRView';
import {
  IVRImageAdjustProperty,
  ISliceImageAdjustProperty,
} from '../../common/defines/imageAdjust';

export interface ICTViewerProps {
  viewerID: string;
  size: ISize;
  active: boolean;
  vrImageAdjust: IVRImageAdjustProperty;
  sliceImageAdjust: ISliceImageAdjustProperty;
  actionProp?: IActionProperty;
}

export interface IViewProperty {
  viewID: string;
  viewType: ViewType;
  positionRatio: IPoint;
  sizeRatio: ISize;
  position: IPoint;
  size: ISize;
  viewFocused: boolean;
  scalebars?: IScalebarProperty[];
}

export interface ICTViewerState {
  viewPropList: IViewProperty[];
}

export const getVolumeState = (
  viewerID: string,
  volumeStates: IVolumeState[]
): IVolumeState | null => {
  const volume = volumeStates.find((volState: IVolumeState) => volState.viewerID === viewerID);
  if (volume !== undefined) return volume;
  return null;
};

export type CombinedCTViewerProps = ICTViewerProps & IVolumeStates;
export abstract class CTViewer extends React.Component<CombinedCTViewerProps, ICTViewerState> {
  private scalebarProperties = [] as IScalebarProperty[];

  constructor(props: CombinedCTViewerProps) {
    super(props);

    this.state = {
      viewPropList: [] as IViewProperty[],
    } as ICTViewerState;

    this.scalebarProperties = makeDefault2DScalebarProperties();
  }

  public componentDidMount(): void {
    this.createViewProperty();
  }

  public componentDidUpdate(prevProps: CombinedCTViewerProps): void {
    const { size } = this.props;

    if (prevProps.size !== size) {
      this.changeViewSizeProperty();
    }
  }

  protected getDefault2DScalebarProperties(): IScalebarProperty[] {
    return this.scalebarProperties;
  }

  protected changeViewSizeProperty(): void {
    this.createViewProperty();
  }

  protected abstract createViewProperty(): void;

  public render(): React.ReactElement {
    const style: React.CSSProperties = {
      position: 'absolute',
    };
    const { viewPropList } = this.state;
    // TODO: Apply vrImageAdjust to 3D Viewers
    // eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
    const { viewerID, volumeStates, vrImageAdjust, sliceImageAdjust, actionProp } = this.props;
    const volState = getVolumeState(viewerID, volumeStates);

    return (
      <div style={style}>
        {viewPropList.map((viewProps) => {
          switch (viewProps.viewType) {
            case ViewType.Volume2DAxial:
            case ViewType.Volume2DSaggital:
            case ViewType.Volume2DCoronal:
              return (
                <VolumeMPRView
                  key={viewProps.viewID}
                  id={viewProps.viewID}
                  position={viewProps.position}
                  size={viewProps.size}
                  viewType={viewProps.viewType}
                  imageAdjust={sliceImageAdjust}
                  imageData={volState ? volState.imageData : null}
                  actionProp={actionProp}
                  scalebars={viewProps.scalebars}
                />
              );
            case ViewType.Volume2DOblique:
              return (
                <VolumeObliqueView
                  key={viewProps.viewID}
                  id={viewProps.viewID}
                  position={viewProps.position}
                  size={viewProps.size}
                  viewType={viewProps.viewType}
                  imageAdjust={sliceImageAdjust}
                  imageData={volState ? volState.imageData : null}
                  actionProp={actionProp}
                  scalebars={viewProps.scalebars}
                />
              );
            case ViewType.Volume2DSection:
              return (
                <VolumeSectionView
                  key={viewProps.viewID}
                  id={viewProps.viewID}
                  position={viewProps.position}
                  size={viewProps.size}
                  viewType={viewProps.viewType}
                  imageAdjust={sliceImageAdjust}
                  imageData={volState ? volState.imageData : null}
                  actionProp={actionProp}
                  scalebars={viewProps.scalebars}
                />
              );
            case ViewType.Volume2DScout:
              return (
                <VolumeScoutView
                  key={viewProps.viewID}
                  id={viewProps.viewID}
                  position={viewProps.position}
                  size={viewProps.size}
                  viewType={viewProps.viewType}
                  imageAdjust={sliceImageAdjust}
                  imageData={volState ? volState.imageData : null}
                  actionProp={actionProp}
                  scalebars={viewProps.scalebars}
                />
              );
            case ViewType.Volume3DPAN:
              return (
                <VolumePanView
                  key={viewProps.viewID}
                  id={viewProps.viewID}
                  position={viewProps.position}
                  size={viewProps.size}
                  viewType={viewProps.viewType}
                  imageData={volState ? volState.imageData : null}
                  actionProp={actionProp}
                />
              );
            case ViewType.Volume3D:
            default:
              return (
                <Volume3DView
                  key={viewProps.viewID}
                  id={viewProps.viewID}
                  position={viewProps.position}
                  size={viewProps.size}
                  viewType={viewProps.viewType}
                  imageData={volState ? volState.imageData : null}
                  actionProp={actionProp}
                />
              );
          }
        })}
      </div>
    );
  }
}

export function mapStateToProps(state: RootState): IVolumeStates {
  const { volumeDataStates } = state;
  return volumeDataStates;
}

export const dispatchToProps = {};
