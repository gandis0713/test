import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';
import AbstractActor from './AbstractActor';

export enum E2DViewRenderMode {
  eAverage = 'average',
  eMIP = 'mip'
}

class VolumeActor2D extends AbstractActor {
  private volumeData: vtkImageData;

  private volumeActor: vtkVolume;

  private volumeMapper: vtkVolumeMapper;

  static getClassType(): string {
    return 'VolumeActor2D';
  }

  constructor() {
    super();
    this.actorType = 'VolumeActor2D';
    this.initializeActor();
  }

  setVolumeData(data: vtkImageData): void {
    this.volumeData = data;

    this.volumeMapper.setInputData(this.volumeData);
    this.volumeActor
      .getProperty()
      .getRGBTransferFunction(0)
      .setMappingRange(-1250, 4250);
    this.volumeData.setDirection([1, 0, 0, 0, 1, 0, 0, 0, -1]);
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

  initializeActor(): void {
    this.volumeActor = vtkVolume.newInstance();
    this.volumeMapper = vtkVolumeMapper.newInstance();
    this.volumeMapper.setSampleDistance(1);
    this.volumeActor.setMapper(this.volumeMapper);
    this.volumeActor.onModified(this.onModified);

    this.volumeActor.setUserMatrix([1, 0, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, -50, 40, -50, 1]);
  }

  setRenderMode(renderMode: E2DViewRenderMode): void {
    if (renderMode === E2DViewRenderMode.eAverage) {
      this.volumeMapper.setBlendModeToAverageIntensity();
    } else if (renderMode === E2DViewRenderMode.eMIP) {
      this.volumeMapper.setBlendModeToMaximumIntensity();
    } else {
      // do nothing
    }
  }
}

export default VolumeActor2D;
