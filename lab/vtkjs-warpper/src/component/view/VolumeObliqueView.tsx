import { connect } from 'react-redux';
import Volume2DView, { IVolume2DViewProps, IVolume2DViewState } from './Volume2DView';
import { RootState } from '../../store/rootReducer';
import { IObjectDBState } from '../../store/reducers/ObjectDB';
import { mapStateToProps, mapDispatchToProps, IDispatchToProps } from './defines/ctViewStoreDefine';

export type IVolumeObliqueViewProps = IVolume2DViewProps;
export type IVolumeObliqueViewState = IVolume2DViewState;

export type CombinedVolumeObliqueViewProps = IVolumeObliqueViewProps &
  IObjectDBState &
  IDispatchToProps;
class VolumeObliqueView<
  Props extends CombinedVolumeObliqueViewProps,
  State extends IVolumeObliqueViewState
> extends Volume2DView<Props, State> {
  protected setVolumeData(): void {
    super.setVolumeData();

    if (this.interactorStyle && this.volumeObject) {
      this.interactorStyle.setSliceOrientation([-1, 0, 0], [0, 1, 0]);
    }

    this.renderWindow.render();
  }
}

export default connect<
  ReturnType<typeof mapStateToProps>,
  IDispatchToProps,
  IVolumeObliqueViewProps,
  RootState
>(
  mapStateToProps,
  mapDispatchToProps
)(VolumeObliqueView);
