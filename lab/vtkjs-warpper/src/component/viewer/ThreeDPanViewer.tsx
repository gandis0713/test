import { connect } from 'react-redux';
import { IScalebarProperty, makeScalebarProperty, ScalebarPosition } from '@ewoosoft/es-scalebar';
import { RootState } from '../../store/rootReducer';
import { ViewType } from '../../common/defines';

import {
  CTViewer,
  ICTViewerProps,
  IViewProperty,
  mapStateToProps,
  dispatchToProps,
} from './CTViewer';

type IThreeDPanViewerProps = ICTViewerProps;

class ThreeDPanViewer extends CTViewer {
  private sectionScalebarProperty = [] as IScalebarProperty[];

  private makeSectionScalebarProperty(): void {
    const rightBar = makeScalebarProperty(ScalebarPosition.Right);
    rightBar.lengthPerClient = 0.7;
    this.sectionScalebarProperty.push(rightBar);
  }

  protected createViewProperty(): void {
    const { size: viewerContainerSize } = this.props;

    this.makeSectionScalebarProperty();

    const viewSection1DPan: IViewProperty = {
      viewID: 'viewSection1DPan',
      viewType: ViewType.Volume3DPAN,
      positionRatio: { x: 0, y: 0 },
      sizeRatio: { width: 1.0, height: 0.6 },
      position: { x: 0, y: 0 },
      size: { width: viewerContainerSize.width, height: viewerContainerSize.height * 0.6 },
      viewFocused: false,
    };
    const viewScout: IViewProperty = {
      viewID: 'viewScout',
      viewType: ViewType.Volume2DScout,
      positionRatio: { x: 0, y: 0.6 },
      sizeRatio: { width: 0.4, height: 0.4 },
      position: { x: 0, y: viewerContainerSize.height * 0.6 },
      size: { width: viewerContainerSize.width * 0.4, height: viewerContainerSize.height * 0.4 },
      viewFocused: false,
      scalebars: this.getDefault2DScalebarProperties(),
    };
    const viewSection1: IViewProperty = {
      viewID: 'viewSection1',
      viewType: ViewType.Volume2DSection,
      positionRatio: { x: 0.6, y: 0.6 },
      sizeRatio: { width: 0.2, height: 0.4 },
      position: { x: viewerContainerSize.width * 0.4, y: viewerContainerSize.height * 0.6 },
      size: { width: viewerContainerSize.width * 0.2, height: viewerContainerSize.height * 0.4 },
      viewFocused: false,
      scalebars: this.sectionScalebarProperty,
    };
    const viewSection2: IViewProperty = {
      viewID: 'viewSection2',
      viewType: ViewType.Volume2DSection,
      positionRatio: { x: 0.6, y: 0.6 },
      sizeRatio: { width: 0.2, height: 0.4 },
      position: { x: viewerContainerSize.width * 0.6, y: viewerContainerSize.height * 0.6 },
      size: { width: viewerContainerSize.width * 0.2, height: viewerContainerSize.height * 0.4 },
      viewFocused: false,
      scalebars: this.sectionScalebarProperty,
    };
    const viewSection3: IViewProperty = {
      viewID: 'viewSection3',
      viewType: ViewType.Volume2DSection,
      positionRatio: { x: 0.6, y: 0.6 },
      sizeRatio: { width: 0.2, height: 0.4 },
      position: { x: viewerContainerSize.width * 0.8, y: viewerContainerSize.height * 0.6 },
      size: { width: viewerContainerSize.width * 0.2, height: viewerContainerSize.height * 0.4 },
      viewFocused: false,
      scalebars: this.sectionScalebarProperty,
    };
    const list: IViewProperty[] = [];
    list.push(viewSection1DPan);
    list.push(viewScout);
    list.push(viewSection1);
    list.push(viewSection2);
    list.push(viewSection3);
    this.setState({ viewPropList: list });
  }
}

export default connect<
  ReturnType<typeof mapStateToProps>,
  typeof dispatchToProps,
  IThreeDPanViewerProps,
  RootState
>(
  mapStateToProps,
  dispatchToProps
)(ThreeDPanViewer);
