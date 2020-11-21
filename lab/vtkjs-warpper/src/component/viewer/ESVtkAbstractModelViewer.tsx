import React from 'react';
import vtkPolyData from 'vtk.js/Sources/Common/DataModel/PolyData';
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import ModelView, { IModelViewProps, IModelViewState } from '../view/ModelView';
import ModelObject from '../../3DObject/ModelObject';
import { ViewType } from '../../common/defines';

import ESVtkAbstractViewer, { IAbstractViewerProps } from './ESVtkAbstractViewer';
import { IModelViewActionProperty } from '../../common/types';

export interface IAbstractModelViewerProps extends IAbstractViewerProps {
  actionProp?: IModelViewActionProperty;
}

export default abstract class ESVtkAbstractModelViewer<
  Props extends IAbstractModelViewerProps
> extends ESVtkAbstractViewer<Props> {
  protected modelObject: ModelObject;

  protected modelView: React.RefObject<ModelView<IModelViewProps, IModelViewState>>;

  constructor(props: Props) {
    super(props);
    this.modelObject = new ModelObject();
    this.modelView = React.createRef<ModelView<IModelViewProps, IModelViewState>>();
  }

  public componentDidMount(): void {
    if (this.modelView.current) {
      this.modelView.current.addActor(this.modelObject.getProp3D());
    }
  }

  protected setPolyData(polyData: vtkPolyData): void {
    this.modelObject.setInputData(polyData);
    if (this.modelView.current) {
      this.modelView.current.resetView();
    }
  }

  protected setActor(actor: vtkActor): void {
    if (this.modelView.current) {
      this.modelView.current.removeActor(this.modelObject.getProp3D());
    }

    this.modelObject.setProp3D(actor);

    if (this.modelView.current) {
      this.modelView.current.addActor(this.modelObject.getProp3D());
      this.modelView.current.resetView();
    }
  }

  public render(): React.ReactElement {
    return (
      <ModelView
        id={this.props.id}
        size={this.props.size}
        position={{ x: 0, y: 0 }}
        viewType={ViewType.Model}
        onMouseDown={this.props.onMouseDown}
        onMouseEnter={this.props.onMouseEnter}
        onMouseLeave={this.props.onMouseLeave}
        actionProp={this.props.actionProp}
        ref={this.modelView}
      />
    );
  }
}
