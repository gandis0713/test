// eslint-disable-next-line @typescript-eslint/class-name-casing

declare class vtkAbstractWidget {
  placeWidget(bounds: number[]): void;
}

declare class vtkDistanceWidget extends vtkAbstractWidget {
  getDistance(): number;
  getManipulator(): vtkPlanePointManipulator;
}

declare class vtkAngleWidget extends vtkAbstractWidget {
  getAngle(): number;
  getManipulator(): vtkPlanePointManipulator;
}

declare class vtkSplineWidget extends vtkAbstractWidget {
}
