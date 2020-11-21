import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import LoadOBJ from '../../io/OBJ';

import ESVtkAbstractModelViewer, { IAbstractModelViewerProps } from './ESVtkAbstractModelViewer';

export interface IOBJModelViewerProps extends IAbstractModelViewerProps {
  obj: string;
  mtl: string;
}

export class ESVtkOBJModelViewer<
  Props extends IOBJModelViewerProps
> extends ESVtkAbstractModelViewer<Props> {
  public componentDidMount(): void {
    super.componentDidMount();

    LoadOBJ(this.props.obj, this.props.mtl)
      .then((actor: vtkActor) => {
        this.setActor(actor);
      })
      .catch((error) => {
        console.debug('error : ', error);
      });
  }

  public componentDidUpdate(preProps: Props): void {
    if (preProps.obj !== this.props.obj || preProps.mtl !== this.props.mtl) {
      LoadOBJ(this.props.obj, this.props.mtl)
        .then((actor: vtkActor) => {
          this.setActor(actor);
        })
        .catch((error) => {
          console.debug('error : ', error);
        });
    }
  }
}
