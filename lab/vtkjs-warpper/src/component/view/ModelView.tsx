/* eslint-disable @typescript-eslint/no-explicit-any */
import vtkActor from 'vtk.js/Sources/Rendering/Core/Actor';
import vtkESInteractorStyle3D from '../../customVtkjs/Interaction/Style/vtkESInteractorStyle3D';
import AbstractView, { IAbstractViewProps, IAbstractViewState } from './AbstractView';
import { ActionType, ActionState, IModelViewActionProperty } from '../../common';
import vtkES2DViewCustomPass from '../../customVtkjs/Rendering/Core/SceneGraph/vtkES2DViewCustomPass';
import vtkES3DViewCustomPass from '../../customVtkjs/Rendering/Core/SceneGraph/vtkES3DViewCustomPass';

export interface IModelViewProps extends IAbstractViewProps {
  actionProp?: IModelViewActionProperty;
}
export type IModelViewState = IAbstractViewState;

class ModelView<Props extends IModelViewProps, State extends IModelViewState> extends AbstractView<
  Props,
  State
> {
  protected interactorStyle: any;

  constructor(props: Props) {
    super(props);

    this.eventInteractorStyleCB = this.eventInteractorStyleCB.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  public eventInteractorStyleCB(event: any): void {
    const { actionState } = event;
    if (actionState === ActionState.Finish) {
      this.interactorStyle.setActionType(ActionType.None);
    }
  }

  protected setInteractorStyle(): void {
    // eslint-disable-next-line import/no-named-as-default-member
    this.interactorStyle = vtkESInteractorStyle3D.newInstance();
    this.interactorStyle.setActionType(ActionType.None);
    this.interactor.setInteractorStyle(this.interactorStyle);
  }

  public componentDidMount(): void {
    super.componentDidMount();

    const { actionProp } = this.props;
    this.interactorStyle.setActionType(actionProp?.actionType);
    this.interactorStyle.setEventCB(this.eventInteractorStyleCB);
    // eslint-disable-next-line import/no-named-as-default-member
    this.glWindow.setRenderPasses([vtkES3DViewCustomPass.newInstance()]);
  }

  public componentDidUpdate(prevProps: IModelViewProps): void {
    super.componentDidUpdate(prevProps);

    const { actionProp } = this.props;
    if (prevProps.actionProp?.actionType !== actionProp?.actionType) {
      this.interactorStyle.setActionType(actionProp?.actionType);
    }
  }

  public addActor(actor: vtkActor): void {
    this.renderer.addActor(actor);
    this.resetView();
  }

  public removeActor(actor: vtkActor): void {
    this.renderer.removeActor(actor);
    this.resetView();
  }
}

export default ModelView;
