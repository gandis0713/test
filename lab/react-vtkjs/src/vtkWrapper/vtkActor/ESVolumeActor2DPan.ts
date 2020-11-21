import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';
import vtkCustomVolumeMapper from '../customClass/rendering/core/ES2DPanVolumeMapper';
import vtkCustomVolume from '../customClass/rendering/core/CustomVolume';
import AbstractActor from './AbstractActor';
import VRColoring, { VRColoringType } from '../vtkVRColoring';
import panoCurveState, { PanoCurve } from '../../store/reducers/curve';

class ESVolumeActor2DPan extends AbstractActor {
  private volumeData: vtkImageData;

  private volumeActor: vtkCustomVolume;

  private volumeMapper: vtkCustomVolumeMapper;

  static getClassType(): string {
    return 'ESVolumeActor2DPan';
  }

  constructor() {
    super();
    this.actorType = 'ESVolumeActor2DPan';
    this.volumeActor = vtkCustomVolume.newInstance();
    this.volumeMapper = vtkCustomVolumeMapper.newInstance();
    this.initializeActor();
  }

  setVolumeData(data: vtkImageData): void {
    this.volumeData = data;

    this.volumeMapper.setInputData(this.volumeData);
    this.volumeData.setDirection([1, 0, 0, 0, 1, 0, 0, 0, -1]);
    // console.log(`volOrientation${this.volumeActor.getMatrix()}`);
  }

  getActor(): vtkCustomVolume {
    return this.volumeActor;
  }

  setActor(actor: vtkCustomVolume): void {
    this.volumeActor = actor;
  }

  setVRColoring(mode: string) {
    this.volumeActor.getProperty().setRGBTransferFunction(0, VRColoring[mode].color);
    this.volumeActor.getProperty().setScalarOpacity(0, VRColoring[mode].opacity);

    const isApplyShade = VRColoringType.bone === mode;

    if (VRColoringType.mip === mode) {
      this.volumeMapper.setBlendModeToMaximumIntensity();
      this.volumeActor.getProperty().setShade(isApplyShade);
    } else if (VRColoringType.bone === mode) {
      this.volumeMapper.setBlendModeToComposite();
      this.volumeActor.getProperty().setShade(isApplyShade);
    } else if (VRColoringType.teeth === mode) {
      this.volumeMapper.setBlendModeToComposite();
      this.volumeActor.getProperty().setShade(isApplyShade);
    } else {
      // do nothing.
    }
  }

  setOpacity(value: number | number[]) {
    this.volumeMapper.setOpacity(value);
  }

  setBrightness(value: number | number[]) {
    this.volumeMapper.setBrightness(value);
  }

  setContrast(value: number | number[]) {
    this.volumeMapper.setContrast(value);
  }

  createCurve() {
    this.volumeMapper.setPanoCurveData(panoCurveState.data);
    this.volumeMapper.setPanoCurveRightNormal(panoCurveState.normal.right);
    this.volumeMapper.setPanoCurveLength(panoCurveState.length);
    this.volumeMapper.setPanoCurveHeight(panoCurveState.height);
  }

  setUserMatrix(mat: number[]) {
    this.volumeActor.setUserMatrix(mat);
  }

  getMatrix() {
    if (this.volumeActor) {
      return this.volumeActor.getMatrix();
    } else {
      return [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1];
    }
  }

  initializeActor(): void {
    this.volumeActor = vtkCustomVolume.newInstance();
    this.volumeMapper = vtkCustomVolumeMapper.newInstance();
    this.volumeMapper.setSampleDistance(1);
    this.volumeActor.setMapper(this.volumeMapper);
    this.volumeActor.onModified(this.onModified);

    // create color and opacity transfer functions
    this.volumeActor.getProperty().setScalarOpacityUnitDistance(0, 3.0);
    this.volumeActor.getProperty().setInterpolationTypeToLinear();
    this.volumeActor.getProperty().setUseGradientOpacity(0, true);
    this.volumeActor.getProperty().setGradientOpacityMinimumValue(0, 2);
    this.volumeActor.getProperty().setGradientOpacityMinimumOpacity(0, 0.0);
    this.volumeActor.getProperty().setGradientOpacityMaximumValue(0, 20);
    this.volumeActor.getProperty().setGradientOpacityMaximumOpacity(0, 1.0);
    this.volumeActor.getProperty().setAmbient(0.2);
    this.volumeActor.getProperty().setDiffuse(0.7);
    this.volumeActor.getProperty().setSpecular(0.3);
    this.volumeActor.getProperty().setSpecularPower(8.0);
    // this.volumeActor.setPosition(-50, 50, -40);
    // this.volumeActor.rotateX(90);
    this.volumeActor.setUserMatrix([1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, -50, 40, -50, 1]);

    this.setVRColoring(VRColoringType.teeth);
  }
}

export default ESVolumeActor2DPan;
