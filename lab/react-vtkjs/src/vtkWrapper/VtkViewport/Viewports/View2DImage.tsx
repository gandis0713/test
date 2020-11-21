/* eslint-disable import/no-named-as-default-member */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkImageMapper from 'vtk.js/Sources/Rendering/Core/ImageMapper';
import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';
import vtkImageSlice from 'vtk.js/Sources/Rendering/Core/ImageSlice';
import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkInteractorStyleImage from 'vtk.js/Sources/Interaction/Style/InteractorStyleImage';
import cuid from 'cuid';
import ViewportOverlay, {
  GetSliceInfoString,
  GetWindowingString
} from '../ViewportOverlay/ViewportOverlay';
import { SliceOrientation, Windowing, ViewApis } from '../CommonDefines';

export interface View2DApis extends ViewApis {
  container: HTMLDivElement | null;
  _component: React.Component;
  updateImage: () => void;
  updateWindowing: (windowWidth: number, windowLevel: number) => void;
  getOrientation: () => SliceOrientation | undefined;
  setSlice: (slice: number) => void;
}

interface VolumeProps {
  volumeData: vtkImageData;
  orientation?: SliceOrientation;
  onDestroyed?: () => void;
  onCreated?: (api2D: View2DApis) => void;
}

interface ViewState {
  windowing: Windowing;
}

export default class View2DImageActor extends Component<VolumeProps, ViewState> {
  renderer: vtkRenderer;

  renderWindow: vtkRenderWindow;

  glWindow: vtkOpenGLRenderWindow;

  interactor: vtkRenderWindowInteractor;

  istyle: vtkInteractorStyleImage;

  imageSliceActor: vtkImageSlice | null;

  imageMapper: vtkImageMapper | null;

  container: React.RefObject<HTMLDivElement>;

  constructor(props) {
    super(props);
    this.container = React.createRef<HTMLDivElement>();
    this.state = {
      windowing: props.imageSliceActor
        ? this.getWindowing(props.imageSliceActor)
        : { windowLevel: 0, windowWidth: 0 }
    };

    this.updateWindowing = this.updateWindowing.bind(this);
    this.getOrientation = this.getOrientation.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.getWindowing = this.getWindowing.bind(this);
    this.setSlice = this.setSlice.bind(this);
    this.handleResize = this.handleResize.bind(this);
  }

  componentDidMount(): void {
    console.log('componentDidMount');
    // Tracking ID to tie emitted events to this component
    const uid = cuid();

    this.renderWindow = vtkRenderWindow.newInstance({
      background: [0, 0, 0]
    });
    this.renderer = vtkRenderer.newInstance();
    this.renderer.setBackground(0.0, 0.0, 0.0);
    this.renderWindow.addRenderer(this.renderer);
    this.glWindow = vtkOpenGLRenderWindow.newInstance();
    // in here, container.current is null.
    this.glWindow.setContainer(this.container.current);
    this.glWindow.setSize(600, 600);
    this.renderWindow.addView(this.glWindow);

    this.interactor = vtkRenderWindowInteractor.newInstance();
    this.interactor.setView(this.glWindow);
    this.interactor.initialize();

    this.istyle = vtkInteractorStyleImage.newInstance();
    this.renderWindow.getInteractor().setInteractorStyle(this.istyle);

    this.imageSliceActor = vtkImageSlice.newInstance();
    this.imageMapper = vtkImageMapper.newInstance();
    this.imageSliceActor.setMapper(this.imageMapper);

    const camera = this.renderer.getActiveCamera();

    camera.setParallelProjection(true);
    this.renderer.resetCamera();

    if (this.props.onCreated) {
      /**
       * Note: The contents of this Object are
       * considered part of the API contract
       * we make with consumers of this component.
       */
      const api: View2DApis = {
        uid, // Tracking id available on `api`
        container: this.container.current,
        _component: this,
        updateImage: this.updateImage,
        updateWindowing: this.updateWindowing,
        getOrientation: this.getOrientation,
        setSlice: this.setSlice,
        type: 'VIEW2D'
      };

      this.props.onCreated(api);
    }
  }

  handleResize(): void {
    if (this.container.current) {
      const contSize = this.container.current.getBoundingClientRect();
      this.glWindow.setSize(contSize.width, contSize.height);
      this.renderer.resetCamera();
      this.renderWindow.render();
    }
  }

  componentDidUpdate(prevProps: VolumeProps): void {
    const currentCont = this.glWindow.getContainer();

    if (currentCont === null && this.container.current) {
      console.log('set Container');
      this.glWindow.setContainer(this.container.current);
      const contSize = this.container.current.getBoundingClientRect();
      console.log('contSize' + contSize.width + ' ' + contSize.height);
      this.glWindow.setSize(contSize.width, contSize.height);

      window.addEventListener('resize', this.handleResize);
      this.interactor.bindEvents(this.container.current);
    }

    if (!prevProps.volumeData && this.props.volumeData) {
      console.log(`volumeData Added`);
      const sliceMode = vtkImageMapper.SlicingMode.K;
      console.log(`volume Data${this.props.volumeData}`);

      const actorProp = this.imageSliceActor.getProperty();
      actorProp.setColorWindow(5500);
      actorProp.setColorLevel(1500);

      this.setCamera(sliceMode, this.props.volumeData);

      // add actors to renderers
      this.imageMapper.setInputData(this.props.volumeData);
      this.renderer.addViewProp(this.imageSliceActor);
      this.renderer.resetCamera();
      this.renderWindow.render();

      const windowing = this.getWindowing(this.imageSliceActor);
      this.updateWindowing(windowing.windowWidth, windowing.windowLevel);
    }
  }

  componentWillUnmount(): void {
    if (this.props.onDestroyed) {
      this.props.onDestroyed();
    }
  }

  setCamera(sliceMode: number, data: vtkImageData): void {
    if (!data) {
      return;
    }
    const ijk = [0, 0, 0];
    const position = [0, 0, 0];
    const focalPoint = [0, 0, 0];

    data.indexToWorldVec3(ijk, focalPoint);
    ijk[sliceMode] = 1;
    data.indexToWorldVec3(ijk, position);
    this.renderer.getActiveCamera().set({ focalPoint, position });
    this.renderer.resetCamera();
  }

  getOrientation(): SliceOrientation | undefined {
    return this.props.orientation;
  }

  getWindowing = (actor: vtkImageSlice): Windowing => {
    const actorProp = actor.getProperty();
    const windowWidth = actorProp.getColorWindow();
    const windowLevel = actorProp.getColorLevel();

    return {
      windowWidth,
      windowLevel
    };
  };

  setSlice(slice: number): void {
    this.imageMapper.setSlice(slice);
    this.updateImage();
  }

  updateImage(): void {
    this.renderWindow.render();
  }

  updateWindowing(windowWidth: number, windowLevel: number): void {
    this.setState({
      windowing: { windowWidth, windowLevel }
    });
  }

  render(): React.ReactElement {
    if (!this.props.volumeData) {
      return <div />;
    }

    const style: React.CSSProperties = {
      width: '100%',
      height: '100%',
      display: 'flex'
    };
    return (
      <div style={style}>
        <div ref={this.container} style={style} />
        <ViewportOverlay
          botRight={GetSliceInfoString(
            this.props.volumeData.getDimensions()[2],
            this.imageMapper.getSlice()
          )}
          botLeft={GetWindowingString(
            this.state.windowing.windowWidth,
            this.state.windowing.windowLevel
          )}
        />
      </div>
    );
  }
}
