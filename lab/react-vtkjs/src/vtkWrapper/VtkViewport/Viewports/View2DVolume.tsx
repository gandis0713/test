/* eslint-disable import/no-named-as-default-member */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';

import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import cuid from 'cuid';
import vtkInteractorStyleMPRSlice from '../../vtkInteraction/vtkInteractorStyleMPRSlice';

import VolumeActor2D, { E2DViewRenderMode } from '../../vtkActor/VolumeActor2D';
import ViewportOverlay, {
  GetSliceInfoString,
  GetWindowingString
} from '../ViewportOverlay/ViewportOverlay';
import { SliceOrientation, Windowing } from '../CommonDefines';

import VTRuler from '../../../widget/Ruler/VTRuler';
import {
  makeCommonRulerState, makeParentViewState, VTRulerState, VTParentViewState
} from '../../../widget/Ruler/VTRulerTypes';

export enum EAxisType {
  eAxial = 'axial',
  eSagittal = 'sagittal',
  eCoronal = 'coronal'
}

export interface View2DVolActorApis {
  uid: string;
  container: HTMLDivElement | null;
  _component: React.Component;
  updateImage: () => void;
  getOrientation: () => SliceOrientation | undefined;
  setSlice: (slice: number) => void;
  setAxisType: (axisType: EAxisType) => void;
  setRenderMode: (renderMode: E2DViewRenderMode) => void;
  type: string;
}

interface View2DVolumeActorProps {
  volumeData: vtkImageData;
  sliceRange: number[];
  currentSlice: number;
  orientation?: SliceOrientation;
  onDestroyed?: () => void;
  onCreated?: (api2D: View2DVolActorApis) => void;
  onIStyleUpdated?: (rangeMax: number, currentSlice: number) => void;
}

interface ViewState {
  windowing: Windowing;
  thickness: number;
}

export default class View2DVolumeActor extends Component<View2DVolumeActorProps, ViewState> {
  private renderer: vtkRenderer;

  private renderWindow: vtkRenderWindow;

  private glWindow: vtkOpenGLRenderWindow;

  private interactor: vtkRenderWindowInteractor;

  private istyle: vtkInteractorStyleMPRSlice;

  private container: React.RefObject<HTMLDivElement>;

  private volActor: VolumeActor2D;

  private rulerStateRight = {} as VTRulerState;
  private rulerStateBottom = {} as VTRulerState;
  private refRulerRight = React.createRef<VTRuler>();
  private refRulerBottom = React.createRef<VTRuler>();

  constructor(props) {
    super(props);
    this.container = React.createRef<HTMLDivElement>();
    this.istyle = vtkInteractorStyleMPRSlice.newInstance();
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
    this.setRenderMode = this.setRenderMode.bind(this);

    this.setupRightRulerState();
    this.setupBottomRulerState();
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
    this.renderWindow.addView(this.glWindow);

    const camera = this.renderer.getActiveCamera();
    camera.setParallelProjection(true);

    if (this.props.onCreated) {
      /**
       * Note: The contents of this Object are
       * considered part of the API contract
       * we make with consumers of this component.
       */
      const api: View2DVolActorApis = {
        uid, // Tracking id available on `api`
        container: this.container.current,
        _component: this,
        updateImage: this.updateImage,
        getOrientation: this.getOrientation,
        setSlice: this.setSlice,
        setAxisType: this.setAxisType,
        setRenderMode: this.setRenderMode,
        type: 'VIEW2D'
      };

      this.props.onCreated(api);
    }
  }

  componentDidUpdate(prevProps: View2DVolumeActorProps): void {
    console.log('componentDidUpdate');

    if (!this.glWindow.getContainer()) {
      console.log(`Add container`);
      this.glWindow.setContainer(this.container.current);
      this.interactor = vtkRenderWindowInteractor.newInstance();
      this.interactor.setView(this.glWindow);
      this.interactor.initialize();
      this.interactor.bindEvents(this.container.current);

      this.renderWindow.getInteractor().setInteractorStyle(this.istyle);

      const camera = this.renderer.getActiveCamera();
      camera.setParallelProjection(true);
    }

    if (!prevProps.volumeData && this.props.volumeData) {
      console.log(`volumeData Added`);

      this.volActor.setVolumeData(this.props.volumeData);
      this.volActor.setRenderMode(E2DViewRenderMode.eAverage);

      this.istyle.setVolumeActor(this.volActor.getActor());
      this.istyle.setSliceOrientation([0, 1, 0], [0, 0, 1]);

      this.renderer.addVolume(this.volActor.getActor());
      this.renderer.resetCamera();

      this.istyle.onModified(this.onIStyleModified);
      this.istyle.setCurrentSliceIndex(40);
      this.istyle.setSlabThickness(this.state.thickness);
      this.interactor.requestAnimation(this.istyle); // Elly: Need to force update view.

      this.renderWindow.render();
    }

    this.setStateRulers();
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

  setRenderMode(renderMode: E2DViewRenderMode): void {
    this.volActor.setRenderMode(renderMode);
  }

  setSlice(slice: number): void {
    console.log(`setSlice: ${slice}`);
    this.istyle.setCurrentSliceIndex(slice);
    this.updateImage();
  }

  updateImage(): void {
    console.log(`Render`);
    this.renderWindow.render();
  }

  setupRightRulerState(): void {
    this.rulerStateRight = makeCommonRulerState('right');
  }

  setupBottomRulerState(): void {
    this.rulerStateBottom = makeCommonRulerState('bottom');
    this.rulerStateBottom.positionMargin = 40;
    this.rulerStateBottom.lengthPerClient = 0.6;
  }

  setStateRulers(): void {
    if (!this.container.current || !this.glWindow || !this.renderer) {
      return;
    }

    const clientRect = this.container.current.getBoundingClientRect();
    var parentViewState = makeParentViewState(clientRect, this.glWindow, this.renderer);

    if (this.refRulerRight.current) {
      this.refRulerRight.current.setState(parentViewState);
    }
    if (this.refRulerBottom.current) {
      this.refRulerBottom.current.setState(parentViewState);
    }
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

    this.setStateRulers();

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
        {this.container.current ?
          <div>
            <VTRuler
              name={'VTBottomRuler'}
              rulerState={this.rulerStateBottom}
              ref={this.refRulerBottom}
            />
            <VTRuler
              name={'VTRightRuler'}
              rulerState={this.rulerStateRight}
              ref={this.refRulerRight}
            />
          </div>
          : <div />}
      </div>
    );
  }
}

