// eslint-disable-next-line import/prefer-default-export
export enum EventType {
  MouseUp = 'mouseup',
  MouseDown = 'mousedown',
  MouseMove = 'mousemove',
  MouseEnter = 'mouseenter',
  MouseLeave = 'mouseleave',
  MouseWheel = 'wheel',
}

export enum ViewType {
  None = '',
  Volume3D = '3D',
  Volume3DPAN = '3DPAN',
  Volume2DAxial = 'Axial',
  Volume2DSaggital = 'Saggital',
  Volume2DCoronal = 'Coronal',
  Volume2DSection = 'Section',
  Volume2DOblique = 'Oblique',
  Volume2DScout = 'Scout',
  Model = 'Model',
}
