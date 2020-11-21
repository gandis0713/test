import { ViewTypes } from 'vtk.js/Sources/Widgets/Core/WidgetManager/Constants';
import vtkWidgetManager from 'vtk.js/Sources/Widgets/Core/WidgetManager';
import { vec3, mat4, ReadonlyMat4, ReadonlyVec3 } from 'gl-matrix';
import { IImplantInfo } from '@ewoosoft/es-common-types';
import vtkImplantWidget from '../../customVtkjs/Widgets/Widgets3D/ImplantWidget';
import vtkES2DViewCustomPass from '../../customVtkjs/Rendering/Core/SceneGraph/vtkES2DViewCustomPass';
import {
  ISliceImageAdjustProperty,
  ViewFilteringMode,
  SliceViewRenderMode,
} from '../../common/defines/imageAdjust';
import VolumeObject2D from '../../3DObject/VolumeObject2D';
import VolumeView, { IVolumeViewProps, IVolumeViewState } from './VolumeView';
import vtkESInteractorStyle2DMPR from '../../customVtkjs/Interaction/Style/vtkESInteractorStyle2DMPR';

import vtkDistanceWidget from '../../customVtkjs/Interaction/Widgets/vtkDistanceWidget';
import { ActionType, ActionState } from '../../common';
import LoadSTL from '../../io/STL';
import { ViewType } from '../../common/defines';
import { IObjectDBState } from '../../store/reducers/ObjectDB';
import { IDispatchToProps } from './defines/ctViewStoreDefine';
import { getNewID } from '../../common/utility/objectIDGenerator';
import { ObjectType, ObjectSharingType } from '../../common/defines/object';
import { createInitialOveralyObject } from '../../common/defines/overlayObject';
import {
  createInitialImplantSet,
  ToothDirection,
  IImplantSetInfo,
} from '../../common/defines/simulationObject';

export interface IVolume2DViewProps extends IVolumeViewProps {
  imageAdjust: ISliceImageAdjustProperty;
}

export type IVolume2DViewState = IVolumeViewState;

export type CombinedVolume2DViewProps = IVolume2DViewProps & IObjectDBState & IDispatchToProps;

class Volume2DView<
  Props extends CombinedVolume2DViewProps,
  State extends IVolume2DViewState
> extends VolumeView<Props, State> {
  protected interactorStyle: typeof vtkESInteractorStyle2DMPR | undefined;

  private curLengthWidget: typeof vtkDistanceWidget | null;

  private curLengthWidgetHandle: any;

  constructor(props: Props) {
    super(props);
    this.curLengthWidget = null;
    this.curLengthWidgetHandle = null;
  }

  // eslint-disable-next-line class-methods-use-this, @typescript-eslint/no-explicit-any
  public eventWidgetCB(event: any): void {
    const { actionState, actionType } = event;
    const { actionProp } = this.props;
    if (actionType === ActionType.Length) {
      if (actionState === ActionState.Start) {
        // this.createLengthWidget();
      } else if (actionState === ActionState.Finish) {
        // this.removeCurrentWidget();
        if (this.curLengthWidgetHandle !== null) {
          // test code about using ObjectDB store.
          // TODO: remove codes after implementing store integration.
          const objectID = getNewID(ObjectType.Length);
          this.props.selectObjectAction(objectID);
          const lengthObj = createInitialOveralyObject(
            objectID,
            ObjectType.Length,
            ObjectSharingType.MPR2DView
          );
          lengthObj.widgetFactory = this.curLengthWidget;
          this.props.addOverlayAction(lengthObj);
          this.objectWidgetHandles.push({
            id: objectID,
            type: ObjectType.Length,
            widgetHandle: this.curLengthWidgetHandle,
          });
        }
        this.widgetManager.releaseFocus();
        this.widgetManager.enablePicking();
        if (actionProp?.onFinish) {
          actionProp.onFinish();
        }
      } else if (actionState === ActionState.Cancel) {
        this.removeCurrentWidget();
        this.widgetManager.releaseFocus();
        this.widgetManager.enablePicking();
      }
    } else if (actionType === ActionType.Implant) {
      if (actionState === ActionState.Finish) {
        // this.finishCurrentWidget();
        this.widgetManager.releaseFocus();
        this.widgetManager.enablePicking();
        if (actionProp?.onFinish) {
          actionProp.onFinish();
        }
      }
    }
  }

  private createLengthWidget(): void {
    // eslint-disable-next-line import/no-named-as-default-member
    const lengthWidget = vtkDistanceWidget.newInstance();
    const lengthWidgetHandle = this.widgetManager.addWidget(lengthWidget, ViewTypes.VOLUME);
    lengthWidgetHandle.setEventCB(this.eventWidgetCB);

    this.widgetManager.grabFocus(lengthWidget);

    this.curLengthWidget = lengthWidget;
    this.curLengthWidgetHandle = lengthWidgetHandle;

    this.updateCurrentWidget(this.curLengthWidget, this.curLengthWidgetHandle);
  }

  protected createCrownWidget(path: string): void {
    LoadSTL(path)
      .then((polyData) => {
        if (this.curLengthWidgetHandle) {
          const handles = this.curLengthWidgetHandle.getWidgetState().getHandleList();
          if (handles.length < 2) {
            return;
          }
          // eslint-disable-next-line import/no-named-as-default-member
          const lengthWidget = vtkImplantWidget.newInstance({ polyData });
          const lengthWidgetHandle = this.widgetManager.addWidget(lengthWidget, ViewTypes.SLICE);
          lengthWidgetHandle.setEventCB(this.eventWidgetCB);
          this.widgetManager.grabFocus(lengthWidget);
          const { imageData, viewType } = this.props;
          const camera = this.renderer.getActiveCamera();
          const { viewUp, viewPlaneNormal } = camera.getState();
          const viewMat = camera.getViewMatrix();
          const viewInvMat = mat4.create();
          mat4.invert(viewInvMat, viewMat);
          console.log('viewMat : ', viewMat);
          console.log('viewInvMat : ', viewInvMat);

          const origin0 = handles[0].getOrigin();
          const origin1 = handles[1].getOrigin();

          const oriMat: ReadonlyMat4 = [1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1];
          const oriInvMat: ReadonlyMat4 = [1, 0, 0, 0, 0, 0, 1, 0, 0, -1, 0, 0, 0, 0, 0, 1];

          const impDir = vec3.create();
          impDir[0] = 0;
          impDir[1] = 0;
          impDir[2] = 1;
          if (viewType === ViewType.Volume2DAxial) {
            impDir[0] = 0;
            impDir[1] = 0;
            impDir[2] = 1;
          } else if (
            viewType === ViewType.Volume2DCoronal ||
            viewType === ViewType.Volume2DSaggital
          ) {
            impDir[0] = 0;
            impDir[1] = 1;
            impDir[2] = 0;
          }
          // vec3.transformMat4(viewPlaneNormal, viewPlaneNormal, reOriMat);
          const upNormal = vec3.create();
          upNormal[0] = origin0[0] - origin1[0];
          upNormal[1] = origin0[1] - origin1[1];
          upNormal[2] = origin0[2] - origin1[2];
          vec3.transformMat4(upNormal, upNormal, oriInvMat);
          // vec3.transformMat4(upNormal, upNormal, oriMat);
          // vec3.transformMat4(upNormal, upNormal, viewInvMat);
          // vec3.transformMat4(upNormal, upNormal, viewMat);
          vec3.normalize(impDir, impDir);
          vec3.normalize(upNormal, upNormal);
          const impDirAxis = vec3.create();
          vec3.cross(impDirAxis, impDir, upNormal);
          // impDirAxis[0] = 1;
          // impDirAxis[1] = -1;
          // impDirAxis[2] = 0;
          vec3.normalize(impDirAxis, impDirAxis);
          // const impDirAxisAngle = 90;
          const impDirAxisAngle =
            (Math.acos(vec3.dot(impDir, upNormal) / (vec3.length(impDir) * vec3.length(upNormal))) *
              180) /
            Math.PI;

          const impDirAxisRadian = (impDirAxisAngle * Math.PI) / 180;
          const impDirRotMat = mat4.create();
          mat4.fromRotation(impDirRotMat, impDirAxisRadian, impDirAxis);
          console.log('impDir : ', impDir);
          console.log('impDirAxis : ', impDirAxis);
          console.log('impDirAxisAngle : ', impDirAxisAngle);
          console.log('impDirRotMat : ', impDirRotMat);

          const angle =
            (Math.acos(
              vec3.dot(viewPlaneNormal, upNormal) /
                (vec3.length(viewPlaneNormal) * vec3.length(upNormal))
            ) *
              180) /
            Math.PI;
          // const angle =
          // (Math.acos(vec3.dot(dir, upNormal) / (vec3.length(dir) * vec3.length(upNormal))) *
          //   180) /
          // Math.PI;
          const axis = vec3.create();
          // vec3.cross(axis, upNormal, viewUp);
          // vec3.cross(axis, viewUp, upNormal);
          // vec3.cross(axis, upNormal, viewPlaneNormal);
          vec3.cross(axis, viewPlaneNormal, upNormal);
          // vec3.cross(axis, upNormal, dir);

          vec3.normalize(axis, axis);
          vec3.normalize(viewPlaneNormal, viewPlaneNormal);
          vec3.normalize(viewUp, viewUp);

          const radian = (angle * Math.PI) / 180;

          const rotMat = mat4.create();
          mat4.fromRotation(rotMat, radian, axis);

          const invertViewMat = mat4.create();
          mat4.invert(invertViewMat, camera.getViewMatrix());
          const finalMat = mat4.create();
          mat4.multiply(finalMat, impDirRotMat, oriMat);
          // mat4.multiply(finalMat, rotMat, reOriMat);
          // mat4.multiply(finalMat, rotMat, [1, 0, 0, 0, 0, 0, -1, 0, 0, 1, 0, 0, 0, 0, 0, 1]);
          // mat4.multiply(finalMat, rotMat, camera.getViewMatrix());
          // mat4.multiply(finalMat, impDirRotMat, reOriMat);
          // mat4.multiply(finalMat, reOriMat, impDirRotMat);
          // const zNormal = [finalMat[8], finalMat[9], finalMat[10]];
          // const yNormal = [finalMat[4], finalMat[5], finalMat[6]];
          // const xNormal = [finalMat[0], finalMat[1], finalMat[2]];

          // const zNormal = [reOriMat[8], reOriMat[9], reOriMat[10]];
          // const yNormal = [reOriMat[4], reOriMat[5], reOriMat[6]];
          // const xNormal = [reOriMat[0], reOriMat[1], reOriMat[2]];

          // const zNormal = [invertViewMat[8], invertViewMat[9], invertViewMat[10]];
          // const yNormal = [invertViewMat[4], invertViewMat[5], invertViewMat[6]];
          // const xNormal = [invertViewMat[0], invertViewMat[1], invertViewMat[2]];

          // const zNormal = [rotMat[8], rotMat[9], rotMat[10]];
          // const yNormal = [rotMat[4], rotMat[5], rotMat[6]];
          // const xNormal = [rotMat[0], rotMat[1], rotMat[2]];

          const zNormal = [impDirRotMat[8], impDirRotMat[9], impDirRotMat[10]];
          const yNormal = [impDirRotMat[4], impDirRotMat[5], impDirRotMat[6]];
          const xNormal = [impDirRotMat[0], impDirRotMat[1], impDirRotMat[2]];

          // const zNormal = [
          //   camera.getViewMatrix()[8],
          //   camera.getViewMatrix()[9],
          //   camera.getViewMatrix()[10],
          // ];
          // const yNormal = [
          //   camera.getViewMatrix()[4],
          //   camera.getViewMatrix()[5],
          //   camera.getViewMatrix()[6],
          // ];
          // const xNormal = [
          //   camera.getViewMatrix()[0],
          //   camera.getViewMatrix()[1],
          //   camera.getViewMatrix()[2],
          // ];

          console.log('camera : ', camera);
          console.log('camera.getViewMatrix() : ', camera.getViewMatrix());
          console.log('camera.getState() : ', camera.getState());
          console.log('invertViewMat : ', invertViewMat);
          console.log('rotMat : ', rotMat);
          console.log('finalMat : ', finalMat);
          console.log('angle : ', angle);
          console.log('axis : ', axis);
          console.log('viewPlaneNormal : ', viewPlaneNormal);
          console.log('viewUp : ', viewUp);
          console.log('origin0 : ', origin0);
          console.log('origin1 : ', origin1);
          console.log('upNormal : ', upNormal);
          console.log('xNormal : ', xNormal);
          console.log('yNormal : ', yNormal);
          console.log('zNormal : ', zNormal);
          console.log('camera.getDirectionOfProjection() : ', camera.getDirectionOfProjection());

          lengthWidgetHandle.setOrigin(origin0);
          lengthWidgetHandle.setOrientation(yNormal, xNormal, zNormal);

          if (lengthWidget) {
            lengthWidget.placeWidget(imageData.getBounds());
            lengthWidget.getManipulator().setOrigin(origin0);
            lengthWidget.getManipulator().setNormal(camera.getDirectionOfProjection());
          }

          if (lengthWidgetHandle) {
            lengthWidgetHandle.updateRepresentationForRender();
          }

          const implantSetID = getNewID(ObjectType.ImplantSet);
          this.props.selectImplantSetAction(implantSetID);
          const implantInfo: IImplantInfo = {
            strCompany: '',
            strLineup: '',
            strModelName: '',
            dLength: 0,
            dTotalLength: 0,
            dOcclusal: 0,
            dApical: 0,
            nModelID: 0,
            imgSTL: '',
            imgPNG: '',
          };

          const implantSet: IImplantSetInfo = {
            id: implantSetID,
            visible: true,
            type: ObjectType.Length,
            sharingType: ObjectSharingType.MPR2DView,
            toothID: '17', // need to be generated
            toothDirection: ToothDirection.eUpperTooth, // need to be generated
            position: [0, 0, 0],
            rotation: {
              rotAxis: [0, 0, 1],
              radian: 0,
            },
            useImplant: true,
            useCrown: false,
            useGuide: false,
            usePath: false,
            implantInfo,
            crownInfo: undefined,
            useLongAxis: false,
            longAxisLength: 0,
            widgetFactory: lengthWidget,
          };

          this.props.addImplantSetAction(implantSet);
          this.widgetManager.releaseFocus();
          this.widgetManager.enablePicking();
          const { actionProp } = this.props;
          if (actionProp?.onFinish) {
            actionProp.onFinish();
          }
        }
      })
      .catch((error) => {
        console.debug('error : ', error);
      });
  }

  protected setInteractorStyle(): void {
    // eslint-disable-next-line import/no-named-as-default-member
    this.interactorStyle = vtkESInteractorStyle2DMPR.newInstance();
    this.interactor.setInteractorStyle(this.interactorStyle);
  }

  protected initialize(): void {
    super.initialize();

    // eslint-disable-next-line import/no-named-as-default-member
    this.glWindow.setRenderPasses([vtkES2DViewCustomPass.newInstance()]);

    this.renderer.getActiveCamera().setParallelProjection(true);
  }

  private finishCurrentWidget(): void {
    // this.curLengthWidget = null;
    // this.curLengthWidgetHandle = null;
  }

  private removeCurrentWidget(): void {
    if (this.curLengthWidget) {
      // this.widgetManager.removeWidget(this.curLengthWidget);
    }

    // this.curLengthWidget = null;
    // this.curLengthWidgetHandle = null;
  }

  public componentDidUpdate(prevProps: CombinedVolume2DViewProps): void {
    super.componentDidUpdate(prevProps);
    if (prevProps.actionProp?.actionType !== this.props.actionProp?.actionType) {
      const acType = this.props.actionProp?.actionType;
      switch (acType) {
        case ActionType.Length:
          this.createLengthWidget();
          break;
        case ActionType.Zooming:
        case ActionType.Panning:
          this.removeCurrentWidget();
          this.widgetManager.disablePicking();
          if (this.interactorStyle) {
            this.interactorStyle.setActionType(acType);
          }
          break;
        case ActionType.Implant:
          this.createCrownWidget('/testdata/mesh/stl/Implant01.stl');
          break;
        case ActionType.Crown:
          this.createCrownWidget('/testdata/mesh/stl/Crown_23.stl');
          break;
        default:
          this.widgetManager.enablePicking();
          if (this.interactorStyle) {
            this.interactorStyle.setActionType(acType);
          }
          break;
      }
    }

    if (
      prevProps.imageAdjust.windowLevel !== this.props.imageAdjust.windowLevel ||
      prevProps.imageAdjust.windowWidth !== this.props.imageAdjust.windowWidth
    ) {
      this.setWindowing(this.props.imageAdjust.windowWidth, this.props.imageAdjust.windowLevel);
    }

    if (prevProps.imageAdjust.inverse !== this.props.imageAdjust.inverse) {
      this.setInverse(this.props.imageAdjust.inverse);
    }

    if (
      prevProps.imageAdjust.smooth !== this.props.imageAdjust.smooth ||
      prevProps.imageAdjust.sharpen !== this.props.imageAdjust.sharpen ||
      prevProps.imageAdjust.maxSharpen !== this.props.imageAdjust.maxSharpen
    ) {
      if (this.props.imageAdjust.smooth) {
        this.setFilteringMode(ViewFilteringMode.eFilterSmooth);
      } else if (this.props.imageAdjust.sharpen) {
        this.setFilteringMode(ViewFilteringMode.eFilterSharpen);
      } else if (this.props.imageAdjust.maxSharpen) {
        this.setFilteringMode(ViewFilteringMode.eFilterMaxSharpen);
      } else {
        this.setFilteringMode(ViewFilteringMode.eFilterNone);
      }
    }

    if (prevProps.imageAdjust.mip !== this.props.imageAdjust.mip) {
      this.setRenderMode(
        this.props.imageAdjust.mip ? SliceViewRenderMode.eMIP : SliceViewRenderMode.eAverage
      );
    }

    const { selectedObjectID, id } = this.props;
    if (prevProps.selectedObjectID !== selectedObjectID) {
      // TODO: Implement object selection
      // eslint-disable-next-line no-console
      console.log(`selected object has been changed in view ${id} : ${selectedObjectID}`);
    }
  }

  public setFilteringMode = (eFilteringMode: ViewFilteringMode): void => {
    (this.volumeObject as VolumeObject2D).setFilteringMode(eFilteringMode);
    this.renderWindow.render();
  };

  public setInverse(on: boolean): void {
    (this.volumeObject as VolumeObject2D).setInverse(on);
    this.renderWindow.render();
  }

  public setWindowing(width: number, level: number): void {
    if (this.volumeObject as VolumeObject2D) {
      (this.volumeObject as VolumeObject2D).setWindowing(width, level);
    }
    this.renderWindow.render();
  }

  public setRenderMode(renderMode: SliceViewRenderMode): void {
    (this.volumeObject as VolumeObject2D).setRenderMode(renderMode);
    this.renderWindow.render();
  }

  protected setVolumeData(): void {
    const { imageData } = this.props;
    if (imageData) {
      this.renderer.getActiveCamera().setParallelProjection(true);
      this.volumeObject = new VolumeObject2D();
      this.volumeObject.setInputData(imageData);
      this.renderer.addVolume(this.volumeObject.getProp3D());

      this.renderer.resetCamera();

      if (this.volumeObject && this.interactorStyle) {
        this.interactorStyle.setVolumeMapper(this.volumeObject.getProp3D().getMapper());
        this.interactorStyle.setSliceThickness(imageData.getSpacing());
        this.interactorStyle.setCenter();
      }

      this.renderWindow.render();
    }
  }

  updateCurrentWidget(widget, handle): void {
    const { imageData } = this.props;
    const camera = this.renderer.getActiveCamera();
    const focalPoint = camera.getReferenceByName('focalPoint');

    if (widget) {
      widget.placeWidget(imageData.getBounds());
      widget.getManipulator().setOrigin(focalPoint);
      widget.getManipulator().setNormal(camera.getDirectionOfProjection());
    }

    if (handle) {
      handle.updateRepresentationForRender();
    }
  }
}

export default Volume2DView;
