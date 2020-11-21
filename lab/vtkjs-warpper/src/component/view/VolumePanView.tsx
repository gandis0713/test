import { connect } from 'react-redux';
import { vec3 } from 'gl-matrix';
import VolumeView, { IVolumeViewProps, IVolumeViewState } from './VolumeView';
import { IPanoCurve } from '../../common/defines/panoCurve';
import VolumeObjectPan from '../../3DObject/VolumeObjectPan';
import { splineKind } from '../../customVtkjs/Common/DataModel/Spline3D/Constants';
import vtkSpline3D from '../../customVtkjs/Common/DataModel/Spline3D';
import { RootState } from '../../store/rootReducer';
import { IObjectDBState } from '../../store/reducers/ObjectDB';
import { mapStateToProps, mapDispatchToProps, IDispatchToProps } from './defines/ctViewStoreDefine';

export type IVolumePanViewProps = IVolumeViewProps;
export type IVolumePanViewState = IVolumeViewState;

export type CombinedVolumePanViewProps = IVolumePanViewProps & IObjectDBState & IDispatchToProps;
class VolumePanView<
  Props extends CombinedVolumePanViewProps,
  State extends IVolumePanViewState
> extends VolumeView<Props, State> {
  protected setVolumeData(): void {
    this.renderer.getActiveCamera().setParallelProjection(true);

    this.volumeObject = new VolumeObjectPan();
    this.volumeObject.setInputData(this.props.imageData);
    this.renderer.addActor(this.volumeObject.getProp3D());

    this.createCurve();

    this.resetView();
  }

  // create default dummy panorama curve
  private createCurve(): void {
    if (this.volumeObject) {
      const curve: IPanoCurve = {
        interval: 1.0,
        thickness: 1.0,
        width: 50.0,
        height: 40.0,
        sectionCenter: 0,
        length: 0,
        data: [],
        normal: {
          right: [],
          forward: [],
        },
      };

      const resolution = 4096;
      const interval = 1.0;
      const resolutionArray = [] as number[];

      const originArray = [] as vec3[];

      const distanceArray = [] as number[];
      const distanceRatio = [] as number[];

      let totalDistance = 0;
      originArray.push([89.13094329833984, 76.94862365722656, 0]);
      originArray.push([70.1806640625, 33.63370132446289, 0]);
      originArray.push([33.63370132446289, 30.9265193939209, 0]);
      originArray.push([14.00662612915039, 70.85746002197266, 0]);

      // eslint-disable-next-line import/no-named-as-default-member
      const spline = vtkSpline3D.newInstance({
        close: false,
        // eslint-disable-next-line no-undef
        kind: splineKind.KOCHANEK_SPLINE,
      });

      spline.computeCoefficients(originArray);
      for (let i = 0; i < originArray.length - 1; i += 1) {
        distanceArray[i] = vec3.distance(originArray[i], originArray[i + 1]);
        totalDistance += distanceArray[i];
      }
      for (let i = 0; i < distanceArray.length; i += 1) {
        distanceRatio[i] = distanceArray[i] / totalDistance;
      }
      for (let i = 0; i < distanceArray.length; i += 1) {
        // eslint-disable-next-line radix
        resolutionArray[i] = Math.floor(resolution * distanceRatio[i]);
      }

      const planeNormal = vec3.create();
      planeNormal[0] = 0;
      planeNormal[1] = 0;
      planeNormal[2] = 1;
      let length = 0;
      for (let i = 0; i < resolutionArray.length; i += 1) {
        for (let j = 1; j < resolutionArray[i]; j += 1) {
          const t1 = (j - 1) / (resolutionArray[i] - 1);
          const t2 = j / (resolutionArray[i] - 1);
          const splineData1 = spline.getPoint(i, t1);
          const splineData2 = spline.getPoint(i, t2);

          const forward = spline.getPrimaryDifferential(i, t1);
          const rightVector = vec3.create();
          vec3.cross(rightVector, planeNormal, forward);
          vec3.normalize(rightVector, rightVector);
          vec3.normalize(forward, forward);

          length += vec3.distance(splineData1, splineData2);
          if (length >= interval) {
            curve.length += length;
            length = 0;
            curve.data.push([splineData1[0] / 100, splineData1[1] / 100, splineData1[2] / 100]);
            curve.normal.forward.push(forward);
            curve.normal.right.push([rightVector[0], rightVector[1], rightVector[2]]);
          }
        }

        curve.sectionCenter = Math.floor(curve.data.length / 2.0);
        const boundZ: number = this.volumeObject.getBounds()[5] - this.volumeObject.getBounds()[4];
        curve.height = boundZ;

        const volume = this.volumeObject as VolumeObjectPan;
        volume.createCurve(curve);
        this.renderWindow.render();
      }
    }
  }
}

export default connect<
  ReturnType<typeof mapStateToProps>,
  IDispatchToProps,
  IVolumePanViewProps,
  RootState
>(
  mapStateToProps,
  mapDispatchToProps
)(VolumePanView);
