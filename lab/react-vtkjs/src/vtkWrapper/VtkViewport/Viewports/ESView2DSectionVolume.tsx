/* eslint-disable import/no-named-as-default-member */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';

import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';

import cuid from 'cuid';
import vtkInteractorStyleSection from '../../vtkInteraction/vtkInteractorStyleSection';
import vtkOpenGLRenderWindow from '../../customClass/rendering/opengl/RenderWindow';
import ESVolumeActor2DSection, {
  E2DViewRenderMode,
  E2DViewFilteringMode
} from '../../vtkActor/ESVolumeActor2DSection';

import ViewportOverlay, { GetWindowingString } from '../ViewportOverlay/ViewportOverlay';
import { SliceOrientation, Windowing } from '../CommonDefines';
import { vec3 } from 'gl-matrix';

export interface View2DSectionVolumeApis {
  uid: string;
  container: HTMLDivElement | null;
  _component: React.Component;
  updateImage: () => void;
  getOrientation: () => SliceOrientation | undefined;
  setWidth: (width: number) => void;
  setHeight: (height: number) => void;
  setAxis: (focalPoint: number[], normalForward: number[], normalRight: number[]) => void;
  setSectionNumber: (sectionNumber: number) => void;
  setCameraZoom: (zoom: number) => void;
  setRenderMode: (renderMode: E2DViewRenderMode) => void;
  setFilteringMode: (eFilteringMode: E2DViewFilteringMode) => void;
  setThickness: (newThickness: number) => void;
  type: string;
}

interface View2DSectionVolumeProps {
  volumeData: vtkImageData;
  currentSlice?: number;
  orientation?: SliceOrientation;
  onDestroyed?: () => void;
  onCreated?: (api2D: View2DSectionVolumeApis) => void;
  onIStyleUpdated?: (rangeMax: number, currentSlice: number) => void;
  onSectionChanged?: (dir: number) => void;
}

interface ViewState {
  windowing: Windowing;
  thickness: number;
  sectionNumber: number;
}

export default class ESView2DSectionVolume extends Component<View2DSectionVolumeProps, ViewState> {
  private renderer: vtkRenderer;

  private renderWindow: vtkRenderWindow;

  private glWindow: vtkOpenGLRenderWindow;

  private interactor: vtkRenderWindowInteractor;

  private istyle: typeof vtkInteractorStyleSection;

  private container: React.RefObject<HTMLDivElement>;

  private volActor: ESVolumeActor2DSection;

  private zoom: number;

  constructor(props) {
    super(props);
    this.container = React.createRef<HTMLDivElement>();
    this.istyle = vtkInteractorStyleSection.newInstance();
    this.glWindow = vtkOpenGLRenderWindow.newInstance();
    this.volActor = new ESVolumeActor2DSection();
    this.state = {
      windowing: { windowLevel: 1500, windowWidth: 5500 },
      thickness: 1.0,
      sectionNumber: 0
    };

    this.zoom = 1.0;

    this.getOrientation = this.getOrientation.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.setWidth = this.setWidth.bind(this);
    this.setHeight = this.setHeight.bind(this);
    this.onIStyleModified = this.onIStyleModified.bind(this);
    this.wheelEvent = this.wheelEvent.bind(this);
    this.setAxis = this.setAxis.bind(this);
    this.setSectionNumber = this.setSectionNumber.bind(this);
    this.setCameraZoom = this.setCameraZoom.bind(this);
    this.setRenderMode = this.setRenderMode.bind(this);
    this.setFilteringMode = this.setFilteringMode.bind(this);
    this.setThickness = this.setThickness.bind(this);
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
    // in here, container.current is null.
    this.glWindow.setContainer(this.container.current);
    this.renderWindow.addView(this.glWindow);

    const camera = this.renderer.getActiveCamera();
    camera.setParallelProjection(true);

    if (this.props.onCreated) {
      /**
       * Note: The contents of this Object are
       * considered part of the API contract
       * we make with consumers of this component.
       */
      const api: View2DSectionVolumeApis = {
        uid, // Tracking id available on `api`
        container: this.container.current,
        _component: this,
        updateImage: this.updateImage,
        getOrientation: this.getOrientation,
        setWidth: this.setWidth,
        setHeight: this.setHeight,
        setAxis: this.setAxis,
        setSectionNumber: this.setSectionNumber,
        setCameraZoom: this.setCameraZoom,
        setRenderMode: this.setRenderMode,
        setFilteringMode: this.setFilteringMode,
        setThickness: this.setThickness,
        type: 'VIEW2D'
      };

      this.props.onCreated(api);
    }
  }

  componentDidUpdate(prevProps: View2DSectionVolumeProps): void {
    console.log('componentDidUpdate');
    const curCont = this.glWindow.getContainer();

    if (!curCont && this.container.current) {
      console.log(`Add container`);
      this.glWindow.setContainer(this.container.current);
      this.interactor = vtkRenderWindowInteractor.newInstance();
      this.interactor.setView(this.glWindow);
      this.interactor.initialize();
      this.interactor.bindEvents(this.container.current);

      // resize
      const contSize = this.container.current.getBoundingClientRect();
      this.glWindow.setSize(contSize.width, contSize.height);

      this.renderWindow.getInteractor().setInteractorStyle(this.istyle);

      const camera = this.renderer.getActiveCamera();
      camera.setParallelProjection(true);
    }

    if (!prevProps.volumeData && this.props.volumeData) {
      console.log(`volumeData Added`);

      this.volActor.setVolumeData(this.props.volumeData);
      this.volActor.setRenderMode(E2DViewRenderMode.eAverage);

      this.renderer.addVolume(this.volActor.getActor());
      this.renderer.resetCamera();
      this.renderer.getActiveCamera().zoom(1.0);

      this.istyle.setThickness(1.0);
      this.istyle.setOrientation([0, 0, 0], [0, 0, -1], [1, 0, 0]);

      this.istyle.onModified(this.onIStyleModified);

      if (this.container.current) {
        this.container.current.addEventListener('wheel', this.wheelEvent);
      }

      this.renderWindow.render();
    }
  }

  wheelEvent(event: MouseWheelEvent): void {
    const dir = event.deltaY > 0 ? -1 : 1;
    if (this.props.onSectionChanged) {
      this.props.onSectionChanged(dir);
    }
  }

  componentWillUnmount(): void {
    if (this.props.onDestroyed) {
      this.props.onDestroyed();
    }
  }

  onIStyleModified(): void {
    console.log('onIStyleModified');
  }

  getOrientation(): SliceOrientation | undefined {
    return this.props.orientation;
  }

  setAxis(focalPoint: number[], normalForward: number[], normalRight: number[]): void {
    this.istyle.setOrientation(focalPoint, normalForward, normalRight);

    this.renderWindow.render();
    this.onIStyleModified();
  }

  setSectionNumber(newSectionNumber: number): void {
    this.setState({
      sectionNumber: newSectionNumber
    });
  }

  setCameraZoom(zoom: number): void {
    const zoomrate = (1.0 / this.zoom) * zoom;
    this.renderer.getActiveCamera().zoom(zoomrate);
    this.zoom = zoom;

    this.renderWindow.render();
    this.onIStyleModified();
  }

  setFilteringMode = (eFilteringMode: E2DViewFilteringMode): void => {
    this.volActor.setFilteringMode(eFilteringMode);
  };

  setRenderMode(renderMode: E2DViewRenderMode): void {
    this.volActor.setRenderMode(renderMode);
  }

  setWidth(width: number): void {
    this.volActor.setWidth(width);
    this.renderWindow.render();
  }

  setHeight(height: number): void {
    this.volActor.setHeight(height);
    this.renderWindow.render();
  }

  setThickness = (newThickness: number): void => {
    this.setState({
      thickness: newThickness
    });
  };

  updateImage(): void {
    console.log(`Render`);
    this.renderWindow.render();
  }

  render(): React.ReactElement {
    if (!this.props.volumeData) {
      return <div />;
    }

    const style: React.CSSProperties = {
      width: '100%',
      height: '100%',
      position: 'relative'
    };

    return (
      <div style={style}>
        <div ref={this.container} style={style} />
        <ViewportOverlay
          topRight={`TH: ${this.state.thickness.toFixed(1)}mm`}
          topLeft={`${this.state.sectionNumber.toFixed(0)}`}
          botLeft={GetWindowingString(
            this.state.windowing.windowWidth,
            this.state.windowing.windowLevel
          )}
        />
      </div>
    );
  }
}
