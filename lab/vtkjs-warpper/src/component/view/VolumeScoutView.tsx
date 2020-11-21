import { connect } from 'react-redux';
import Volume2DView, { IVolume2DViewProps, IVolume2DViewState } from './Volume2DView';
import { RootState } from '../../store/rootReducer';
import { IObjectDBState } from '../../store/reducers/ObjectDB';
import { mapStateToProps, mapDispatchToProps, IDispatchToProps } from './defines/ctViewStoreDefine';

export type IVolumeScoutViewProps = IVolume2DViewProps;
export type IVolumeScoutViewState = IVolume2DViewState;

export type CombinedVolumeScoutViewProps = IVolumeScoutViewProps &
  IObjectDBState &
  IDispatchToProps;
class VolumeScoutView<
  Props extends CombinedVolumeScoutViewProps,
  State extends IVolumeScoutViewState
> extends Volume2DView<Props, State> {
  protected setVolumeData(): void {
    super.setVolumeData();

    if (this.interactorStyle && this.volumeObject) {
      this.interactorStyle.setSliceOrientation([0, 1, 0], [0, 0, 1]);
    }

    this.renderWindow.render();
  }
}

export default connect<
  ReturnType<typeof mapStateToProps>,
  IDispatchToProps,
  IVolumeScoutViewProps,
  RootState
>(
  mapStateToProps,
  mapDispatchToProps
)(VolumeScoutView);
