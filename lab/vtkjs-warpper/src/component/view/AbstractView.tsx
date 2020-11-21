/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable import/no-named-as-default-member */
import React from 'react';
import * as vtkMath from 'vtk.js/Sources/Common/Core/Math';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import { ISize, IPoint } from '@ewoosoft/es-common-types';
import {
  ScalebarView,
  IScalebarProperty,
  IScalebarViewDimensions,
  defaultPixelPitch,
} from '@ewoosoft/es-scalebar';
import vtkOpenGLRenderWindow from '../../customVtkjs/Rendering/OpenGL/RenderWindow';
import vtkESRenderWindowInteractor from '../../customVtkjs/Rendering/Core/vtkESRenderWindowInteractor';
import { EventType, ViewType } from '../../common/defines';
import ViewFrame from './common/ViewFrame';
import vtkES3DViewCustomPass from '../../customVtkjs/Rendering/Core/SceneGraph/vtkES3DViewCustomPass';

export interface IAbstractViewProps {
  id: string;
  size: ISize;
  viewType: ViewType;
  position: IPoint;
  onMouseDown?: (id: string) => void;
  onMouseEnter?: (id: string) => void;
  onMouseLeave?: (id: string) => void;

  scalebars?: IScalebarProperty[];
}

export interface IAbstractViewState {
  scalebarDimensions: IScalebarViewDimensions;
}

const intialViewSize = {
  width: 400,
  height: 400,
} as ISize;

abstract class AbstractView<
  Props extends IAbstractViewProps,
  State extends IAbstractViewState
> extends React.Component<Props, State> {
  protected renderer: vtkRenderer;

  protected renderWindow: vtkRenderWindow;

  protected glWindow: typeof vtkOpenGLRenderWindow;

  protected interactor: typeof vtkESRenderWindowInteractor;

  protected interactorStyle: any;

  protected container: React.RefObject<HTMLDivElement>;

  // Scalebar objects defines
  private zIndexInnder = 1;

  private zIndexScalebar = this.zIndexInnder + 1;

  private clientState = {} as IScalebarViewDimensions;
  //   end of Scalebar objects defines

  constructor(props: Props) {
    super(props);
    this.container = React.createRef<HTMLDivElement>();
    this.glWindow = vtkOpenGLRenderWindow.newInstance();
    this.eventCB = this.eventCB.bind(this);

    this.state = {
      scalebarDimensions: {
        width: intialViewSize.width,
        height: intialViewSize.height,
        realWidth: 0,
        realHeight: 0,
        pixelSizeXmm: 0,
        pixelSizeYmm: 0,
      },
    } as State;
  }

  public componentDidMount(): void {
    this.initialize();

    const camera = this.renderer.getActiveCamera();

    // To redraw scalebar, when Zoomed in/out, camera set after load new Image Data
    camera.onModified(() => {
      this.updateState();
    });
  }

  public componentDidUpdate(preProp: IAbstractViewProps): void {
    const { size } = this.props;
    this.updateSize(preProp.size, size);
    if (preProp.size.width !== size.width || preProp.size.height !== size.height) {
      this.updateState();
    }
  }

  public componentWillUnmount(): void {
    this.glWindow.setContainer(null);
    this.glWindow.delete();
  }

  protected abstract setInteractorStyle(): void;

  private getPropsOfScalebarView(): IScalebarProperty[] {
    const { viewType, scalebars } = this.props;

    switch (viewType) {
      default:
      case ViewType.None:
      case ViewType.Volume3D:
      case ViewType.Volume3DPAN:
      case ViewType.Model:
        return [];
      case ViewType.Volume2DAxial:
      case ViewType.Volume2DSaggital:
      case ViewType.Volume2DCoronal:
      case ViewType.Volume2DSection:
      case ViewType.Volume2DOblique:
      case ViewType.Volume2DScout:
        break;
    }

    if (scalebars === undefined) {
      return [];
    }

    return scalebars as IScalebarProperty[];
  }

  public eventCB(event: React.MouseEvent<HTMLElement>): void {
    const { id, onMouseDown } = this.props;
    const { type } = event;
    switch (type) {
      case EventType.MouseDown:
        if (onMouseDown) {
          onMouseDown(id);
        }
        break;
      default:
        break;
    }
  }

  protected initialize(): void {
    const { size } = this.props;
    this.renderWindow = vtkRenderWindow.newInstance();
    this.renderer = vtkRenderer.newInstance();
    this.renderer.setBackground(0, 0, 0);
    this.renderWindow.addRenderer(this.renderer);

    this.glWindow.setContainer(this.container.current);
    this.glWindow.setSize(size.width, size.height);
    this.renderWindow.addView(this.glWindow);

    this.interactor = vtkESRenderWindowInteractor.newInstance();
    this.interactor.setEventCB(this.eventCB);
    this.interactor.setView(this.glWindow);
    this.interactor.initialize();
    this.interactor.bindEvents(this.container.current);

    this.setInteractorStyle();

    // eslint-disable-next-line import/no-named-as-default-member
    this.glWindow.setRenderPasses([vtkES3DViewCustomPass.newInstance()]);
  }

  // make Scalebar State for display Scalebars
  private updateStateOfScalebarView(clientSize: ISize): void {
    const pointUpperLeft = this.glWindow.displayToWorld(0, 0, 0, this.renderer);
    const pointUpperRight = this.glWindow.displayToWorld(clientSize.width - 1, 0, 0, this.renderer);
    const pointLowerLeft = this.glWindow.displayToWorld(0, clientSize.height - 1, 0, this.renderer);

    let realLengthX = vtkMath.distance2BetweenPoints(pointUpperLeft, pointUpperRight);
    let realLengthY = vtkMath.distance2BetweenPoints(pointUpperLeft, pointLowerLeft);

    realLengthX = Math.sqrt(realLengthX);
    realLengthY = Math.sqrt(realLengthY);

    this.setState({
      scalebarDimensions: {
        width: clientSize.width,
        height: clientSize.height,
        realWidth: realLengthX,
        realHeight: realLengthY,
        pixelSizeXmm: defaultPixelPitch,
        pixelSizeYmm: defaultPixelPitch,
      },
    });
  }

  protected updateSize(preSize: ISize, newSize: ISize): void {
    if (preSize.width !== newSize.width || preSize.height !== newSize.height) {
      this.glWindow.setSize(newSize.width, newSize.height);
      this.renderWindow.render();
    }
  }

  public resetView(): void {
    this.renderer.resetCamera();
    this.renderWindow.render();
  }

  private updateState(): void {
    const { size } = this.props;

    this.updateStateOfScalebarView(size);
  }

  public render(): React.ReactElement {
    const { position, size, viewType } = this.props;
    const { scalebarDimensions } = this.state;

    const scalebarProps = this.getPropsOfScalebarView();

    // When display Scalebar
    if (scalebarProps.length > 0) {
      return (
        <ViewFrame position={position} size={size} viewType={viewType}>
          <div style={{ position: 'relative' }}>
            <div
              ref={this.container}
              style={{ position: 'absolute', left: 0, top: 0, zIndex: this.zIndexInnder }}
            />
            <div style={{ position: 'absolute', left: 0, top: 0, zIndex: this.zIndexScalebar }}>
              <ScalebarView
                name="ESScalebar"
                drawingProperties={scalebarProps}
                parentViewDimensions={scalebarDimensions}
              />
            </div>
          </div>
        </ViewFrame>
      );
    }

    // without Scalebar
    return (
      <ViewFrame position={position} size={size} viewType={viewType}>
        <div ref={this.container} />
      </ViewFrame>
    );
  }
}

export default AbstractView;
