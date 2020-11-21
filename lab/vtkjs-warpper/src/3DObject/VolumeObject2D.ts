/* eslint-disable import/no-named-as-default-member */
import VolumeObject from './VolumeObject';
import { Object3DType } from './AbstractObject';
import vtkESVolumeMapper from '../customVtkjs/Rendering/Core/ES2DVolumeMapper';
import vtkESVolume from '../customVtkjs/Rendering/Core/ESVolume';
import VRColoring, { VRColoringType } from '../common/defines/vrColoring';
import { ViewFilteringMode, SliceViewRenderMode } from '../common/defines/imageAdjust';

class VolumeObject2D extends VolumeObject {
  constructor() {
    super();
    this.type = Object3DType.eVolume2D;
    this.initialize();
  }

  protected initialize(): void {
    this.prop3D = vtkESVolume.newInstance();
    const mapper = vtkESVolumeMapper.newInstance();
    mapper.setSampleDistance(1);
    this.prop3D.setMapper(mapper);

    this.prop3D.onModified(this.onModified);
    mapper.setSampleDistance(1);

    this.prop3D.getProperty().getRGBTransferFunction(0).setMappingRange(-1250, 4250);
    this.prop3D.getProperty().getRGBTransferFunction(0).setMappingRange(-1250, 4250);

    this.setRenderMode(SliceViewRenderMode.eAverage);
  }

  public setRenderMode(renderMode: SliceViewRenderMode): void {
    const mapper = this.prop3D.getMapper();
    if (renderMode === SliceViewRenderMode.eAverage) {
      mapper.setBlendModeToAverageIntensity();
    } else if (renderMode === SliceViewRenderMode.eMIP) {
      mapper.setBlendModeToMaximumIntensity();
    } else {
      // do nothing
    }
  }

  public setWindowing(width: number, level: number): void {
    const mappingMin = level - Math.ceil(width / 2);
    const mappingMax = level + Math.ceil(width / 2);
    this.prop3D.getProperty().getRGBTransferFunction(0).setMappingRange(mappingMin, mappingMax);
  }

  public setInverse(on: boolean): void {
    if (on) {
      this.setVRColoring(VRColoringType.inverse);
    } else {
      this.setVRColoring(VRColoringType.intensity);
    }
  }

  public setVRColoring(mode: string): void {
    this.prop3D.getProperty().setRGBTransferFunction(0, VRColoring[mode].color);
    this.prop3D.getProperty().setScalarOpacity(0, VRColoring[mode].opacity);
  }

  public setFilteringMode = (eFilteringMode: ViewFilteringMode): void => {
    this.prop3D.getMapper().setFilteringMode(eFilteringMode);
  };
}

export default VolumeObject2D;
