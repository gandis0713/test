import { connect } from 'react-redux';
import Volume2DView, { IVolume2DViewProps, IVolume2DViewState } from './Volume2DView';
import { ViewType } from '../../common/defines';
import { RootState } from '../../store/rootReducer';
import { IObjectDBState } from '../../store/reducers/ObjectDB';
import { mapStateToProps, mapDispatchToProps, IDispatchToProps } from './defines/ctViewStoreDefine';

export type IVolumeMPRViewProps = IVolume2DViewProps;
export type IVolumeMPRViewState = IVolume2DViewState;

export type CombinedVolumeMPRViewProps = IVolumeMPRViewProps & IObjectDBState & IDispatchToProps;
class VolumeMPRView<
  Props extends CombinedVolumeMPRViewProps,
  State extends IVolumeMPRViewState
> extends Volume2DView<Props, State> {
  protected setVolumeData(): void {
    super.setVolumeData();

    this.setOrientation();

    this.renderWindow.render();
  }

  protected setOrientation(): void {
    const { viewType } = this.props;

    if (this.interactorStyle && this.volumeObject) {
      switch (viewType) {
        case ViewType.Volume2DSaggital:
          this.interactorStyle.setSliceOrientation([-1, 0, 0], [0, 1, 0]);
          break;
        case ViewType.Volume2DCoronal:
          // this.interactorStyle.setSliceOrientation([0, 0, 1], [0, -1, 0]);
          break;
        case ViewType.Volume2DAxial:
        default:
          this.interactorStyle.setSliceOrientation([0, 1, 0], [0, 0, 1]);
          break;
      }
    }
  }
}

export default connect<
  ReturnType<typeof mapStateToProps>,
  IDispatchToProps,
  IVolumeMPRViewProps,
  RootState
>(
  mapStateToProps,
  mapDispatchToProps
)(VolumeMPRView);
