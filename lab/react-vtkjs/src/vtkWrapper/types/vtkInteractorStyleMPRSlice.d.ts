// eslint-disable-next-line @typescript-eslint/class-name-casing
declare class vtkInteractorStyleMPRSlice {
  setVolumeActor(volume: vtkVolume): void;
  onModified(callback: function): void;
  setSlice(sl: number): void;
  setSliceNormal(x: number, y: number, z: number): void;
  setCurrentSliceIndex(slIndex: number): void;
  getCurrentSliceIndex(): number;
  setSlabThickness(thickness: number): void;
  getSlice(): number;
  getSliceRange(): number[];
  getTotalSliceCount(): number;
  setEnabled(enable: boolean): void;
  setSliceOrientation(normal: number[], viewUp: number[]): void;
}
