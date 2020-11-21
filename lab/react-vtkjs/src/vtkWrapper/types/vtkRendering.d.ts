declare class vtkCustomVolume {
  getProperty(): vtkVolumeProperty;
  setMapper(mapper: vtkCustomVolumeMapper): void;
  setUserMatrix(mat: number[]): void;
  getMatrix(): number[];
  onModified(callback: Function): void;
}

declare class vtkOpenGLRenderWindow {
  setContainer(container: HTMLDivElement | null): void;
  getContainer(): HTMLDivElement | null;
  setSize(width: number, height: number): void;
}

declare class vtkCustomVolumeMapper {
  setFilteringMode(mode: number): void;
  setClipWidth(width: number): void;
  setClipHeight(height: number): void;
  setInputData(volume: vtkImageData): void;
  setSampleDistance(dist: number): void;
  setBlendModeToAverageIntensity(): void;
  setBlendModeToMaximumIntensity(): void;
  setBlendModeToComposite(): void;
  setOpacity(value: number | number[]): void;
  setBrightness(value: number | number[]): void;
  setContrast(value: number | number[]): void;
  setPanoCurveData(value: number[][]): void;
  setPanoCurveRightNormal(value: number[][]): void;
  setPanoCurveLength(value: number): void;
  setPanoCurveHeight(value: number): void;
}
