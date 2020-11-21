import { connect } from 'react-redux';
import VolumeView, { IVolumeViewProps, IVolumeViewState } from './VolumeView';
import VolumeObject3D from '../../3DObject/VolumeObject3D';
import { RootState } from '../../store/rootReducer';
import { IObjectDBState } from '../../store/reducers/ObjectDB';
import { mapStateToProps, mapDispatchToProps, IDispatchToProps } from './defines/ctViewStoreDefine';

export type IVolume3DViewProps = IVolumeViewProps;
export type IVolume3DViewState = IVolumeViewState;

export type CombinedVolume3DViewProps = IVolume3DViewProps & IObjectDBState & IDispatchToProps;
class Volume3DView<
  Props extends CombinedVolume3DViewProps,
  State extends IVolume3DViewState
> extends VolumeView<Props, State> {
  protected setVolumeData(): void {
    const { imageData } = this.props;
    if (imageData) {
      this.renderer.getActiveCamera().setParallelProjection(true);
      this.volumeObject = new VolumeObject3D();
      this.volumeObject.setInputData(this.props.imageData);
      this.renderer.addActor(this.volumeObject.getProp3D());
    }

    this.resetView();
  }
}

export default connect<
  ReturnType<typeof mapStateToProps>,
  IDispatchToProps,
  IVolume3DViewProps,
  RootState
>(
  mapStateToProps,
  mapDispatchToProps
)(Volume3DView);
