import React, { useEffect, useState } from 'react';
import { ISize } from '@ewoosoft/es-common-types';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import * as VolumeAction from '../../store/actions/volume';
import * as AdjustAction from '../../store/actions/imageAdjust';
import { CTViewerLayout, IImageAdjustProperty, IActionProperty } from '../../common/types';
import MPRViewer from '../viewer/MPRViewer';
import ObliqueViewer from '../viewer/ObliqueViewer';
import ThreeDPanViewer from '../viewer/ThreeDPanViewer';
import { IVolumeState } from '../../store/reducers/volume';

export interface ICTViewerControllerProps {
  id: string;
  data: string | string[] | FileList | ArrayBuffer[] | Blob[];
  size: ISize;
  layoutType: CTViewerLayout;
  active: boolean;
  adjustProp?: IImageAdjustProperty;
  actionProp?: IActionProperty;
}

export const getVolumeState = (
  viewerID: string,
  volumeStates: IVolumeState[]
): IVolumeState | null => {
  const volume = volumeStates.find((volState: IVolumeState) => volState.viewerID === viewerID);
  if (volume !== undefined) return volume;
  return null;
};

export default function CTViewerController(props: ICTViewerControllerProps): React.ReactElement {
  const { id, active, data, size, layoutType, adjustProp, actionProp } = props;
  const [linkImageAdjustProps, SetLinkImageAdjustProps] = useState<boolean>(active);
  const { volumeStates } = useSelector((state: RootState) => state.volumeDataStates);
  const { vrImageAdjust, sliceImageAdjust, windowingRange } = useSelector(
    (state: RootState) => state.imageAdjustState
  );

  const dispatch = useDispatch();

  const topMostZIndex = 5000;

  useEffect(() => {
    if (volumeStates.length === 0 && data.length > 0) {
      dispatch(VolumeAction.loadRequestAction(id, data));
    }
  }, [data]);

  useEffect(() => {
    const volume = volumeStates.find((volState) => volState.viewerID === id);
    if (volume && volume.imageData) {
      if (active) {
        if (actionProp && actionProp.onViewerActivated) {
          const imAdjustProp: IImageAdjustProperty = { ...vrImageAdjust, ...sliceImageAdjust };
          actionProp.onViewerActivated(imAdjustProp, windowingRange);
        }
      }
    }
  }, [volumeStates]);

  useEffect(() => {
    if (active === true) {
      if (actionProp && actionProp.onViewerActivated) {
        const imAdjustProp: IImageAdjustProperty = { ...vrImageAdjust, ...sliceImageAdjust };
        actionProp.onViewerActivated(imAdjustProp, windowingRange);
      }
    }
    SetLinkImageAdjustProps(active);
  }, [active]);

  useEffect(() => {
    if (active === true && linkImageAdjustProps === true) {
      if (adjustProp && sliceImageAdjust.windowWidth !== adjustProp.windowWidth) {
        dispatch(AdjustAction.changeWindowingWidthAction(adjustProp.windowWidth));
      }
      if (adjustProp && sliceImageAdjust.windowLevel !== adjustProp.windowLevel) {
        dispatch(AdjustAction.changeWindowingLevelAction(adjustProp.windowLevel));
      }

      if (adjustProp && sliceImageAdjust.smooth !== adjustProp.smooth) {
        dispatch(AdjustAction.setFilteringSmoothAction(adjustProp.smooth));
      }

      if (adjustProp && sliceImageAdjust.sharpen !== adjustProp.sharpen) {
        dispatch(AdjustAction.setFilteringSharpenAction(adjustProp.sharpen));
      }

      if (adjustProp && sliceImageAdjust.maxSharpen !== adjustProp.maxSharpen) {
        dispatch(AdjustAction.setFilteringMaxSharpenAction(adjustProp.maxSharpen));
      }

      if (adjustProp && sliceImageAdjust.mip !== adjustProp.mip) {
        dispatch(AdjustAction.setFilteringMIPAction(adjustProp.mip));
      }

      if (adjustProp && sliceImageAdjust.inverse !== adjustProp.inverse) {
        dispatch(AdjustAction.setFilteringInverseAction(adjustProp.inverse));
      }
    }
  }, [adjustProp]);

  // TODO: Modify Style
  const style: React.CSSProperties = {
    position: 'absolute',
    left: '0px',
    top: '0px',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: `${size.width}px`,
    height: `${size.height}px`,
    fontSize: '30px',
    color: 'white',
    zIndex: topMostZIndex, // To place loading string top most position
  };
  const style2: React.CSSProperties = {
    position: 'absolute',
    left: '0px',
    top: '0px',
    width: `${size.width}px`,
    height: `${size.height}px`,
    backgroundColor: '#00000033',
  };

  const ViewerLayout = (viewerLayoutType: CTViewerLayout): React.ReactElement => {
    switch (viewerLayoutType) {
      case CTViewerLayout.LayoutOblique:
        return (
          <ObliqueViewer
            viewerID={id}
            size={size}
            active={false}
            vrImageAdjust={vrImageAdjust}
            sliceImageAdjust={sliceImageAdjust}
            actionProp={actionProp}
          />
        );
      case CTViewerLayout.Layout3DPAN:
        return (
          <ThreeDPanViewer
            viewerID={id}
            size={size}
            active={false}
            vrImageAdjust={vrImageAdjust}
            sliceImageAdjust={sliceImageAdjust}
            actionProp={actionProp}
          />
        );
      case CTViewerLayout.LayoutMPR:
      default:
        return (
          <MPRViewer
            viewerID={id}
            size={size}
            active={false}
            vrImageAdjust={vrImageAdjust}
            sliceImageAdjust={sliceImageAdjust}
            actionProp={actionProp}
          />
        );
    }
  };

  // TODO: Add Progress UI
  const Progress = (): React.ReactElement => {
    const volState = getVolumeState(id, volumeStates);

    let element: React.ReactElement = <div />;
    if (volState === null) return element;
    const { isLoading, isDecompressing, isDicomLoading, progress } = volState;

    if (isLoading) {
      if (isDecompressing) {
        element = <div style={style}>{`Decompressing - ${Math.ceil(progress * 100)} %`}</div>;
      } else if (isDicomLoading) {
        element = <div style={style}>{`DICOM Loading - ${Math.ceil(progress * 100)} %`}</div>;
      } else {
        element = <div style={style}>Preparing...</div>;
      }
    }

    return element;
  };

  return (
    <div>
      <div style={style2}>{ViewerLayout(layoutType)}</div>
      {Progress()}
    </div>
  );
}
