/* eslint-disable import/no-named-as-default-member */
import VolumeObject from './VolumeObject';
import { Object3DType } from './AbstractObject';
import VRColoring, { VRColoringType } from '../common/defines/vrColoring';
import vtkESPanVolumeMapper from '../customVtkjs/Rendering/Core/ES2DPanVolumeMapper';
import vtkESVolume from '../customVtkjs/Rendering/Core/ESVolume';
import { IPanoCurve } from '../common/defines/panoCurve';

class VolumeObjectPan extends VolumeObject {
  constructor() {
    super();
    this.type = Object3DType.eVolume3D;
    this.initialize();
  }

  protected initialize(): void {
    this.prop3D = vtkESVolume.newInstance();
    const mapper = vtkESPanVolumeMapper.newInstance();
    mapper.setSampleDistance(1);
    this.prop3D.setMapper(mapper);

    this.prop3D.onModified(this.onModified);
    mapper.setSampleDistance(1);

    // create color and opacity transfer functions
    this.prop3D.getProperty().setScalarOpacityUnitDistance(0, 3.0);
    this.prop3D.getProperty().setInterpolationTypeToLinear();
    this.prop3D.getProperty().setUseGradientOpacity(0, true);
    this.prop3D.getProperty().setGradientOpacityMinimumValue(0, 2);
    this.prop3D.getProperty().setGradientOpacityMinimumOpacity(0, 0.0);
    this.prop3D.getProperty().setGradientOpacityMaximumValue(0, 20);
    this.prop3D.getProperty().setGradientOpacityMaximumOpacity(0, 1.0);
    this.prop3D.getProperty().setAmbient(0.2);
    this.prop3D.getProperty().setDiffuse(0.7);
    this.prop3D.getProperty().setSpecular(0.3);
    this.prop3D.getProperty().setSpecularPower(8.0);

    this.setVRColoring(VRColoringType.teeth);
  }

  public setVRColoring(mode: string): void {
    this.prop3D.getProperty().setRGBTransferFunction(0, VRColoring[mode].color);
    this.prop3D.getProperty().setScalarOpacity(0, VRColoring[mode].opacity);

    const isApplyShade = VRColoringType.bone === mode;
    const mapper = this.prop3D.getMapper();

    if (VRColoringType.mip === mode) {
      mapper.setBlendModeToMaximumIntensity();
      this.prop3D.getProperty().setShade(isApplyShade);
    } else if (VRColoringType.bone === mode) {
      mapper.setBlendModeToComposite();
      this.prop3D.getProperty().setShade(isApplyShade);
    } else if (VRColoringType.teeth === mode) {
      mapper.setBlendModeToComposite();
      this.prop3D.getProperty().setShade(isApplyShade);
    } else {
      // do nothing.
    }
  }

  public createCurve(curve: IPanoCurve): void {
    const mapper = this.prop3D.getMapper();
    mapper.setPanoCurveData(curve.data);
    mapper.setPanoCurveRightNormal(curve.normal.right);
    mapper.setPanoCurveLength(curve.length);
    mapper.setPanoCurveHeight(curve.height);
  }
}

export default VolumeObjectPan;
