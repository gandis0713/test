import vtkAbstractWidgetFactory from 'vtk.js/Sources/Widgets/Core/AbstractWidgetFactory';

export enum ObjectType {
  Length = 'Length',
  Angle = 'Angle',
  ImplantSet = 'ImplantSet',
  Implant = 'Implant',
  Crown = 'Crown',
  Canal = 'Canal',
  Unknown = 'Unknown',
}

export enum ObjectSharingType { // same with "ESharingOverlay" of Ez3D-i
  MPR2DView,
  MPR3DView,
  eMPR2DAnd3D, // i.e. Volume Measure
  SectionalPanoView,
  SectionalScoutView,
  SectionalSectionView,
  VolumePanoView,
  VolumePanoAxialView,
  VolumePanoSectionView,
  eNoSharing,
  eAllSharing,
}

export interface IObjectInfo {
  id: string;
  visible: boolean;
  type: ObjectType;
  sharingType: ObjectSharingType;
  widgetFactory: vtkAbstractWidgetFactory | null;
}
