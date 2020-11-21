/* eslint-disable import/no-named-as-default-member */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';

import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';

import cuid from 'cuid';
import vtkInteractorStyleMPRSlice from '../../vtkInteraction/vtkInteractorStyleMPRSlice';
import vtkOpenGLRenderWindow from '../../customClass/rendering/opengl/RenderWindow';
import VolumeActor2D, {
  E2DViewRenderMode,
  E2DViewFilteringMode
} from '../../vtkActor/ESVolumeActor2D';

import ViewportOverlay, {
  GetSliceInfoString,
  GetWindowingString
} from '../ViewportOverlay/ViewportOverlay';
import { SliceOrientation, Windowing } from '../CommonDefines';

export enum EAxisType {
  eAxial = 'axial',
  eSagittal = 'sagittal',
  eCoronal = 'coronal'
}

export interface View2DVolumeApis {
  uid: string;
  container: HTMLDivElement | null;
  _component: React.Component;
  updateImage: () => void;
  getOrientation: () => SliceOrientation | undefined;
  setSlice: (slice: number) => void;
  setAxisType: (axisType: EAxisType) => void;
  setAxis: (normalUp: number[], normalRight: number[]) => void;
  setRenderMode: (renderMode: E2DViewRenderMode) => void;
  setFilteringMode: (eFilteringMode: E2DViewFilteringMode) => void;
  setThickness: (newThickness: number) => void;
  type: string;
}

interface View2DVolumeProps {
  volumeData: vtkImageData;
  sliceRange: number[];
  currentSlice: number;
  orientation?: SliceOrientation;
  axisType?: EAxisType;
  onDestroyed?: () => void;
  onCreated?: (api2D: View2DVolumeApis) => void;
  onIStyleUpdated?: (rangeMax: number, currentSlice: number) => void;
}

interface ViewState {
  windowing: Windowing;
  thickness: number;
}

export default class ESView2DVolume extends Component<View2DVolumeProps, ViewState> {
  private renderer: vtkRenderer;

  private renderWindow: vtkRenderWindow;

  private glWindow: vtkOpenGLRenderWindow;

  private interactor: vtkRenderWindowInteractor;

  private istyle: vtkInteractorStyleMPRSlice;

  private container: React.RefObject<HTMLDivElement>;

  private volActor: VolumeActor2D;

  constructor(props) {
    super(props);
    this.container = React.createRef<HTMLDivElement>();
    this.istyle = vtkInteractorStyleMPRSlice.newInstance();
    this.glWindow = vtkOpenGLRenderWindow.newInstance();
    this.volActor = new VolumeActor2D();
    this.state = {
      windowing: { windowLevel: 1500, windowWidth: 5500 },
      thickness: 10
    };

    this.getOrientation = this.getOrientation.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.setSlice = this.setSlice.bind(this);
    this.onIStyleModified = this.onIStyleModified.bind(this);
    this.setAxisType = this.setAxisType.bind(this);
    this.setAxis = this.setAxis.bind(this);
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
      const api: View2DVolumeApis = {
        uid, // Tracking id available on `api`
        container: this.container.current,
        _component: this,
        updateImage: this.updateImage,
        getOrientation: this.getOrientation,
        setSlice: this.setSlice,
        setAxisType: this.setAxisType,
        setAxis: this.setAxis,
        setRenderMode: this.setRenderMode,
        setFilteringMode: this.setFilteringMode,
        setThickness: this.setThickness,
        type: 'VIEW2D'
      };

      this.props.onCreated(api);
    }
  }

  componentDidUpdate(prevProps: View2DVolumeProps): void {
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

      this.istyle.setVolumeActor(this.volActor.getActor());

      this.renderer.addVolume(this.volActor.getActor());
      this.renderer.resetCamera();

      this.istyle.onModified(this.onIStyleModified);
      this.istyle.setSlabThickness(this.state.thickness);
      // this.interactor.requestAnimation(this.istyle); // Elly: Need to force update view.

      if (this.props.axisType) {
        this.setAxisType(this.props.axisType);
        console.log('setAxisType : ', this.props.axisType);
      } else {
        this.istyle.setSliceOrientation([0, 1, 0], [0, 0, 1]);
        this.istyle.setCurrentSliceIndex(40);
      }

      this.renderWindow.render();
    }
  }

  componentWillUnmount(): void {
    if (this.props.onDestroyed) {
      this.props.onDestroyed();
    }
  }

  onIStyleModified(): void {
    console.log('onIStyleModified');
    const total = this.istyle.getTotalSliceCount();
    const slice = this.istyle.getCurrentSliceIndex();
    console.log(`onIStyleModified - ${total} ${slice}`);
    if (this.props.onIStyleUpdated) {
      this.props.onIStyleUpdated(total - 1, slice);
    }
  }

  getOrientation(): SliceOrientation | undefined {
    return this.props.orientation;
  }

  setAxisType(axisType: EAxisType): void {
    console.log(`set axis type${axisType}`);
    switch (axisType) {
      case EAxisType.eSagittal:
        console.log('sagittal');
        this.istyle.setSliceOrientation([-1, 0, 0], [0, 1, 0]);
        this.istyle.setCurrentSliceIndex(50);
        break;
      case EAxisType.eCoronal:
        console.log('coronal');
        this.istyle.setSliceOrientation([0, 0, -1], [0, 1, 0]);
        this.istyle.setCurrentSliceIndex(50);
        break;
      default:
        console.log('default');
        this.istyle.setSliceOrientation([0, 1, 0], [0, 0, 1]);
        this.istyle.setCurrentSliceIndex(40);
        break;
    }

    this.onIStyleModified();
  }

  setAxis(NormalUp: number[], NormalRight: number[]): void {
    console.log('NormalUp : ', NormalUp);
    console.log('NormalRight : ', NormalRight);

    this.istyle.setSliceOrientation(NormalUp, NormalRight);
    this.istyle.setCurrentSliceIndex(40);

    this.onIStyleModified();
  }

  setFilteringMode = (eFilteringMode: E2DViewFilteringMode): void => {
    this.volActor.setFilteringMode(eFilteringMode);
  };

  setRenderMode(renderMode: E2DViewRenderMode): void {
    this.volActor.setRenderMode(renderMode);
  }

  setSlice(slice: number): void {
    console.log(`setSlice: ${slice}`);
    this.istyle.setCurrentSliceIndex(slice);
    this.updateImage();
  }

  setThickness = (newThickness: number): void => {
    this.istyle.setSlabThickness(newThickness);

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
    const brString = `${GetSliceInfoString(this.props.sliceRange[1], this.props.currentSlice)}`;

    return (
      <div style={style}>
        <div ref={this.container} style={style} />
        <ViewportOverlay
          topRight={`TH: ${this.state.thickness.toFixed(1)}mm`}
          botRight={brString}
          botLeft={GetWindowingString(
            this.state.windowing.windowWidth,
            this.state.windowing.windowLevel
          )}
        />
      </div>
    );
  }
}
