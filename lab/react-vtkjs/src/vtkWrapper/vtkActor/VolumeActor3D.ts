import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';
import AbstractActor from './AbstractActor';
import VRColoring, { VRColoringType } from '../vtkVRColoring';

class VolumeActor3D extends AbstractActor {
  private volumeData: vtkImageData;

  private volumeActor: vtkVolume;

  private volumeMapper: vtkVolumeMapper;

  static getClassType(): string {
    return 'VolumeActor3D';
  }

  constructor() {
    super();
    this.actorType = 'VolumeActor3D';
    this.initializeActor();
  }

  setVolumeData(data: vtkImageData): void {
    this.volumeData = data;

    this.volumeMapper.setInputData(this.volumeData);
    this.volumeData.setDirection([1, 0, 0, 0, 1, 0, 0, 0, -1]);
    console.log(`volOrientation${this.volumeActor.getMatrix()}`);
  }

  getActor(): vtkVolume {
    return this.volumeActor;
  }

  setActor(actor: vtkVolume): void {
    this.volumeActor = actor;
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

  initializeActor(): void {
    this.volumeActor = vtkVolume.newInstance();
    this.volumeMapper = vtkVolumeMapper.newInstance();
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

export default VolumeActor3D;
