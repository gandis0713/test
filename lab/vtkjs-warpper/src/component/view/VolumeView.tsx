import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';
import vtkAbstractWidget from 'vtk.js/Sources/Widgets/Core/AbstractWidget';
import vtkWidgetManager from 'vtk.js/Sources/Widgets/Core/WidgetManager';
import { ViewTypes } from 'vtk.js/Sources/Widgets/Core/WidgetManager/Constants';
import vtkESInteractorStyle3D from '../../customVtkjs/Interaction/Style/vtkESInteractorStyle3D';
import AbstractView, { IAbstractViewProps, IAbstractViewState } from './AbstractView';
import VolumeObject from '../../3DObject/VolumeObject';
import { ActionType, ActionState, IActionProperty } from '../../common';
import { IObjectDBState } from '../../store/reducers/ObjectDB';
import { IDispatchToProps } from './defines/ctViewStoreDefine';
import { ObjectType } from '../../common/defines/object';

export interface IObjectWidgetHandle {
  id: string;
  type: ObjectType;
  widgetHandle: vtkAbstractWidget;
}

export interface IVolumeViewProps extends IAbstractViewProps {
  imageData: vtkImageData | null;
  actionProp?: IActionProperty;
}

export type IVolumeViewState = IAbstractViewState;

export type CombinedVolumeViewProps = IVolumeViewProps & IObjectDBState & IDispatchToProps;

class VolumeView<
  Props extends CombinedVolumeViewProps,
  State extends IVolumeViewState
> extends AbstractView<Props, State> {
  protected volumeObject: VolumeObject | null;

  protected objectWidgetHandles: IObjectWidgetHandle[];

  protected widgetManager: vtkWidgetManager;

  constructor(props: Props) {
    super(props);
    this.volumeObject = null;
    this.objectWidgetHandles = [];

    this.widgetManager = vtkWidgetManager.newInstance();

    this.eventInteractorStyleCB = this.eventInteractorStyleCB.bind(this);
    this.eventWidgetCB = this.eventWidgetCB.bind(this);
  }

  // eslint-disable-next-line class-methods-use-this
  public eventInteractorStyleCB(event: any): void {
    const { actionState } = event;
    const { actionProp } = this.props;
    if (actionState === ActionState.Finish) {
      this.interactorStyle.setActionType(ActionType.None);
      if (actionProp?.onFinish) {
        actionProp.onFinish();
      }
    }
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars, no-unused-vars
  public eventWidgetCB(event: any): void {
    // TODO: Implementation
  }

  protected initialize(): void {
    super.initialize();

    this.widgetManager.enablePicking();
    this.widgetManager.setRenderer(this.renderer);
  }

  protected setInteractorStyle(): void {
    // eslint-disable-next-line import/no-named-as-default-member
    this.interactorStyle = vtkESInteractorStyle3D.newInstance();
    this.interactor.setInteractorStyle(this.interactorStyle);
  }

  public componentDidMount(): void {
    super.componentDidMount();
    this.setVolumeData();

    const { actionProp } = this.props;
    this.interactorStyle.setActionType(actionProp?.actionType);
    this.interactorStyle.setEventCB(this.eventInteractorStyleCB);
  }

  public componentDidUpdate(prevProps: CombinedVolumeViewProps): void {
    super.componentDidUpdate(prevProps);

    if (prevProps.imageData !== this.props.imageData) {
      this.setVolumeData();
    }

    const { actionProp } = this.props;
    if (prevProps.actionProp?.actionType !== actionProp?.actionType) {
      this.interactorStyle.setActionType(actionProp?.actionType);
    }

    const { overlayList, implantSetList } = this.props;
    if (prevProps.overlayList !== overlayList) {
      // TODO: This code is example of store interation. it should be removed after implementing object sharing.
      // eslint-disable-next-line no-console
      console.log(`overlay list has been changed${this.props.viewType}`);
      if (overlayList.length > 0 && this.objectWidgetHandles.length === 0) {
        const overlay = overlayList[0];
        const lengthWidgetHandle = this.widgetManager.addWidget(
          overlay.widgetFactory,
          ViewTypes.VOLUME
        );
        lengthWidgetHandle.updateRepresentationForRender();
        lengthWidgetHandle.setEventCB(this.eventWidgetCB);
        this.objectWidgetHandles.push({
          id: overlay.id,
          type: overlay.type,
          widgetHandle: lengthWidgetHandle,
        });
        this.renderWindow.render();
      }
    }

    if (prevProps.implantSetList !== implantSetList) {
      // TODO: This code is example of store interation. it should be removed after implementing object sharing.
      // eslint-disable-next-line no-console
      console.log(`implant set list has been changed${this.props.viewType}`);
      if (implantSetList.length > 0 && this.objectWidgetHandles.length === 1) {
        const implantSet = implantSetList[0];
        const implantSetWidgetHandle = this.widgetManager.addWidget(
          implantSet.widgetFactory,
          ViewTypes.VOLUME
        );
        implantSetWidgetHandle.updateRepresentationForRender();
        implantSetWidgetHandle.setEventCB(this.eventWidgetCB);
        this.objectWidgetHandles.push({
          id: implantSet.id,
          type: implantSet.type,
          widgetHandle: implantSetWidgetHandle,
        });
        this.renderWindow.render();
      }
    }
  }

  protected setVolumeData(): void {
    this.volumeObject = new VolumeObject();
    this.volumeObject.setInputData(this.props.imageData);
    this.renderer.addActor(this.volumeObject.getProp3D());
  }
}

export default VolumeView;
