import { connect } from 'react-redux';
import Volume2DView, { IVolume2DViewProps, IVolume2DViewState } from './Volume2DView';
import { RootState } from '../../store/rootReducer';
import { IObjectDBState } from '../../store/reducers/ObjectDB';
import { mapStateToProps, mapDispatchToProps, IDispatchToProps } from './defines/ctViewStoreDefine';

export type IVolumeSectionViewProps = IVolume2DViewProps;
export type IVolumeSectionViewState = IVolume2DViewState;

export type CombinedVolumeSectionViewProps = IVolumeSectionViewProps &
  IObjectDBState &
  IDispatchToProps;
class VolumeSectionView<
  Props extends CombinedVolumeSectionViewProps,
  State extends IVolumeSectionViewState
> extends Volume2DView<Props, State> {
  protected setVolumeData(): void {
    super.setVolumeData();

    if (this.interactorStyle && this.volumeObject) {
      this.interactorStyle.setSliceOrientation([0, 0.7, 0.7], [0.7, 0.7, 0]); // TODO : set Section Orientation.
    }

    this.renderWindow.render();
  }
}

export default connect<
  ReturnType<typeof mapStateToProps>,
  IDispatchToProps,
  IVolumeSectionViewProps,
  RootState
>(
  mapStateToProps,
  mapDispatchToProps
)(VolumeSectionView);
