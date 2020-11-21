import { connect } from 'react-redux';
import { RootState } from '../../store/rootReducer';
import { ViewType } from '../../common/defines';

import {
  CTViewer,
  ICTViewerProps,
  IViewProperty,
  mapStateToProps,
  dispatchToProps,
} from './CTViewer';

type IMPRViewerProps = ICTViewerProps;

class MPRViewer extends CTViewer {
  protected createViewProperty(): void {
    const { size: viewerContainerSize } = this.props;
    const view3D: IViewProperty = {
      viewID: 'view3D',
      viewType: ViewType.Volume3D,
      positionRatio: { x: 0, y: 0 },
      sizeRatio: { width: 0.5, height: 0.5 },
      position: { x: 0, y: 0 },
      size: { width: viewerContainerSize.width / 2, height: viewerContainerSize.height / 2 },
      viewFocused: false,
    };
    const viewAxial: IViewProperty = {
      viewID: 'viewAxial',
      viewType: ViewType.Volume2DAxial,
      positionRatio: { x: 0.5, y: 0 },
      sizeRatio: { width: 0.5, height: 0.5 },
      position: { x: viewerContainerSize.width / 2, y: 0 },
      size: { width: viewerContainerSize.width / 2, height: viewerContainerSize.height / 2 },
      viewFocused: false,
      scalebars: this.getDefault2DScalebarProperties(),
    };
    const viewSagittal: IViewProperty = {
      viewID: 'viewSagittal',
      viewType: ViewType.Volume2DSaggital,
      positionRatio: { x: 0, y: 0.5 },
      sizeRatio: { width: 0.5, height: 0.5 },
      position: { x: 0, y: viewerContainerSize.height / 2 },
      size: { width: viewerContainerSize.width / 2, height: viewerContainerSize.height / 2 },
      viewFocused: false,
      scalebars: this.getDefault2DScalebarProperties(),
    };
    const viewCoronal: IViewProperty = {
      viewID: 'viewCoronal',
      viewType: ViewType.Volume2DCoronal,
      positionRatio: { x: 0.5, y: 0.5 },
      sizeRatio: { width: 0.5, height: 0.5 },
      position: { x: viewerContainerSize.width / 2, y: viewerContainerSize.height / 2 },
      size: { width: viewerContainerSize.width / 2, height: viewerContainerSize.height / 2 },
      viewFocused: false,
      scalebars: this.getDefault2DScalebarProperties(),
    };
    const list: IViewProperty[] = [];
    list.push(view3D);
    list.push(viewAxial);
    list.push(viewSagittal);
    list.push(viewCoronal);
    this.setState({ viewPropList: list });
  }
}

export default connect<
  ReturnType<typeof mapStateToProps>,
  typeof dispatchToProps,
  IMPRViewerProps,
  RootState
>(
  mapStateToProps,
  dispatchToProps
)(MPRViewer);
