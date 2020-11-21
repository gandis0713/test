import vtkStateBuilder from 'vtk.js/Sources/Widgets/Core/StateBuilder';

export default function generateState() {
  return vtkStateBuilder
    .createBuilder()
    .addStateFromMixin({
      labels: ['handles'],
      mixins: ['origin', 'color', 'scale1', 'visible', 'orientation'],
      name: 'handle',
      initialValues: {
        color: 0.5,
        scale1: 30,
        origin: [0, 0, 0],
        visible: true,
      },
    })
    .build();
}
