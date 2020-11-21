/* eslint-disable import/no-named-as-default-member */
import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';
import vtkCustomVolumeMapper from '../customClass/rendering/core/ES2DSectionVolumeMapper';
import vtkCustomVolume from '../customClass/rendering/core/CustomVolume';
import AbstractActor from './AbstractActor';

export enum E2DViewRenderMode {
  eAverage = 'average',
  eMIP = 'mip'
}

export enum E2DViewFilteringMode {
  eFilterNone = 0,
  eFilterSmooth = 1,
  eFilterSharpen = 2
}

class ESVolumeActor2DSection extends AbstractActor {
  private volumeData: vtkImageData;

  private volumeActor: vtkCustomVolume;

  private volumeMapper: vtkCustomVolumeMapper;

  static getClassType(): string {
    return 'VolumeActor2D';
  }

  constructor() {
    super();
    this.actorType = 'VolumeActor2DSection';
    this.volumeActor = vtkCustomVolume.newInstance();
    this.volumeMapper = vtkCustomVolumeMapper.newInstance();
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
    const boundX: number = this.volumeData.getBounds()[0] + this.volumeData.getBounds()[1];
    const boundY: number = this.volumeData.getBounds()[2] + this.volumeData.getBounds()[3];
    const boundZ: number = this.volumeData.getBounds()[4] + this.volumeData.getBounds()[5];

    this.volumeActor.setUserMatrix([
      1,
      0,
      0,
      0,
      0,
      0,
      1,
      0,
      0,
      1,
      0,
      0,
      -boundX / 2,
      -boundZ / 2,
      -boundY / 2,
      1
    ]);
  }

  getActor(): vtkCustomVolume {
    return this.volumeActor;
  }

  setActor(actor: vtkCustomVolume): void {
    this.volumeActor = actor;
  }

  initializeActor(): void {
    this.volumeMapper.setSampleDistance(0.2);
    this.volumeActor.setMapper(this.volumeMapper);
    this.volumeActor.onModified(this.onModified);

    this.volumeMapper.setFilteringMode(E2DViewFilteringMode.eFilterNone);
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

  setFilteringMode(eFilteringMode: E2DViewFilteringMode): void {
    this.volumeMapper.setFilteringMode(eFilteringMode);
  }

  setWidth(width: number): void {
    console.log('width : ', width);
    this.volumeMapper.setClipWidth(width);
  }

  setHeight(height: number): void {
    console.log('height : ', height);
    this.volumeMapper.setClipHeight(height);
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
}

export default ESVolumeActor2DSection;
