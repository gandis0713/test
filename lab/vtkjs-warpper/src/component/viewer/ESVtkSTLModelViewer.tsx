import vtkPolyData from 'vtk.js/Sources/Common/DataModel/PolyData';
import LoadSTL from '../../io/STL';

import ESVtkAbstractModelViewer, { IAbstractModelViewerProps } from './ESVtkAbstractModelViewer';

export interface ISTLModelViewerProps extends IAbstractModelViewerProps {
  data: File | string;
}

export class ESVtkSTLModelViewer<
  Props extends ISTLModelViewerProps
> extends ESVtkAbstractModelViewer<Props> {
  public componentDidMount(): void {
    super.componentDidMount();
    LoadSTL(this.props.data)
      .then((polyData: vtkPolyData) => {
        this.setPolyData(polyData);
      })
      .catch((error) => {
        console.debug('error : ', error);
      });
  }

  public componentDidUpdate(preProps: Props): void {
    if (preProps.data !== this.props.data) {
      LoadSTL(this.props.data)
        .then((polyData: vtkPolyData) => {
          this.setPolyData(polyData);
        })
        .catch((error) => {
          console.debug('error : ', error);
        });
    }
  }
}
