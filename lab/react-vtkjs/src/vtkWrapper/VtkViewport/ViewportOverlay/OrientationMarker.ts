import vtkOrientationMarkerWidget from 'vtk.js/Sources/Interaction/Widgets/OrientationMarkerWidget';
import vtkAnnotatedCubeActor from 'vtk.js/Sources/Rendering/Core/AnnotatedCubeActor';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';

export default class OrientationMarker {
  private axes: vtkAnnotatedCubeActor;

  private orientationWidget: vtkOrientationMarkerWidget;

  constructor(interactor: vtkRenderWindowInteractor) {
    this.initialize(interactor);
  }

  updateMarkerOrientation(): void {
    this.orientationWidget.updateMarkerOrientation();
  }

  initialize(interactor: vtkRenderWindowInteractor): void {
    // create axes
    this.axes = vtkAnnotatedCubeActor.newInstance();
    this.axes.setDefaultStyle({
      text: '+X',
      fontStyle: 'bold',
      fontFamily: 'Arial',
      fontColor: 'black',
      fontSizeScale: res => res / 2,
      faceColor: '#0000ff',
      faceRotation: 0,
      edgeThickness: 0.1,
      edgeColor: 'black',
      resolution: 400
    });
    // axes.setXPlusFaceProperty({ text: '+X' });
    this.axes.setXMinusFaceProperty({
      text: '-X',
      faceColor: '#ffff00',
      faceRotation: 90,
      fontStyle: 'italic'
    });
    this.axes.setYPlusFaceProperty({
      text: '+Y',
      faceColor: '#00ff00',
      fontSizeScale: res => res / 4
    });
    this.axes.setYMinusFaceProperty({
      text: '-Y',
      faceColor: '#00ffff',
      fontColor: 'white'
    });
    this.axes.setZPlusFaceProperty({
      text: '+Z',
      edgeColor: 'yellow'
    });
    this.axes.setZMinusFaceProperty({ text: '-Z', faceRotation: 45, edgeThickness: 0 });

    this.orientationWidget = vtkOrientationMarkerWidget.newInstance({
      actor: this.axes,
      interactor
    });
    this.orientationWidget.setEnabled(true);
    this.orientationWidget.setViewportCorner(vtkOrientationMarkerWidget.Corners.BOTTOM_RIGHT);
    this.orientationWidget.setViewportSize(0.1);
    this.orientationWidget.setMinPixelSize(60);
    this.orientationWidget.setMaxPixelSize(300);
  }
}
