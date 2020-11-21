/* eslint-disable import/no-named-as-default-member */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';

import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';
import vtkPolyData from 'vtk.js/Sources/Common/DataModel/PolyData';

import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
// eslint-disable-next-line max-len
import vtkInteractorStyleTrackballCamera from 'vtk.js/Sources/Interaction/Style/InteractorStyleTrackballCamera';
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';

import cuid from 'cuid';

import ViewportOverlay from '../ViewportOverlay/ViewportOverlay';
import OrientationMarker from '../ViewportOverlay/OrientationMarker';
import VolumeActor3D from '../../vtkActor/VolumeActor3D';
import ModelActor3D from '../../vtkActor/ModelActor3D';
import AbstractActor from '../../vtkActor/AbstractActor';

import { SliceOrientation } from '../CommonDefines';

import VTRuler from '../../../widget/Ruler/VTRuler';
import {
  makeCommonRulerState, makeParentViewState, VTRulerState
} from '../../../widget/Ruler/VTRulerTypes';

export interface View3DVolApis {
  uid: string;
  // container: HTMLDivElement | null;
  _component: React.Component;
  getOrientation: () => SliceOrientation | undefined;
  setModelOpacity: (opacity: number) => void;
  setVRColoring: (mode: string) => void;
  type: string;
}

interface View3DVolumeProps {
  volumeData: vtkImageData;
  modelData: vtkPolyData[];
  orientation?: SliceOrientation;
  onDestroyed?: () => void;
  onCreated?: (api3D: View3DVolApis) => void;
}

interface ViewState {
  coloringMode: string;
}

const container = React.createRef<HTMLDivElement>();

export default class View3DVolumeActor extends Component<View3DVolumeProps, ViewState> {
  private renderer: vtkRenderer;

  private renderWindow: vtkRenderWindow;

  private glWindow: vtkOpenGLRenderWindow;

  private interactor: vtkRenderWindowInteractor;

  private actors: AbstractActor[];

  private initialized: boolean;

  private orientationWidget: OrientationMarker | null = null;

  private rulerStateLeft = {} as VTRulerState;
  private rulerStateTop = {} as VTRulerState;
  private refRulerLeft = React.createRef<VTRuler>();
  private refRulerTop = React.createRef<VTRuler>();

  constructor(props) {
    super(props);

    this.actors = [];
    this.initialized = false;
    this.state = {
      coloringMode: 'Teeth'
    };
    this.getOrientation = this.getOrientation.bind(this);
    this.setModelOpacity = this.setModelOpacity.bind(this);
    this.setVRColoring = this.setVRColoring.bind(this);
    this.handleResize = this.handleResize.bind(this);

    this.setupLeftRulerState();
    this.setupTopRulerState();
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
    console.log(`container:${container.current}`);
    this.glWindow.setContainer(container.current);
    this.renderWindow.addView(this.glWindow);

    const camera = this.renderer.getActiveCamera();
    camera.setParallelProjection(true);
    console.log(`camera.getThickness()${camera.getThickness()}`);

    if (this.props.onCreated) {
      /**
       * Note: The contents of this Object are
       * considered part of the API contract
       * we make with consumers of this component.
       */
      const api: View3DVolApis = {
        uid, // Tracking id available on `api`
        // container: container.current,
        _component: this,
        getOrientation: this.getOrientation,
        setModelOpacity: this.setModelOpacity,
        setVRColoring: this.setVRColoring,
        type: 'VIEW3D'
      };

      this.props.onCreated(api);
    }

    camera.onModified(() => {
      this.setStateRulers();
    });
  }

  setStateRulers(): boolean {
    if (!container.current || !this.glWindow || !this.renderer) {
      return false;
    }

    const clientRect = container.current.getBoundingClientRect();
    var parentViewState = makeParentViewState(clientRect, this.glWindow, this.renderer);

    if (this.refRulerLeft.current) {
      this.refRulerLeft.current.setState(parentViewState);
    }
    if (this.refRulerTop.current) {
      this.refRulerTop.current.setState(parentViewState);
    }

    return true;
  }

  handleResize(): void {
    if (container.current) {
      const contSize = container.current.getBoundingClientRect();
      this.glWindow.setSize(contSize.width, contSize.height);
      this.renderer.resetCamera();
      this.renderWindow.render();
    }
  }

  setVRColoring(mode: string) {
    this.setState({
      coloringMode: mode
    });
    this.actors.forEach(actor => {
      if (actor.getActorType() === VolumeActor3D.getClassType()) {
        (actor as VolumeActor3D).setVRColoring(mode);
      }
    });
    this.renderWindow.render();
  }

  componentDidUpdate(prevProps: View3DVolumeProps): void {
    console.log('componentDidUpdate@View3DVolume');

    if (!this.glWindow.getContainer() && container.current !== null && this.initialized === false) {
      console.log(`Add container`);

      const camera = this.renderer.getActiveCamera();
      camera.setParallelProjection(true);

      this.glWindow.setContainer(container.current);
      this.interactor = vtkRenderWindowInteractor.newInstance();
      this.interactor.setView(this.glWindow);
      this.interactor.initialize();
      this.interactor.bindEvents(container.current);
      this.interactor.setInteractorStyle(vtkInteractorStyleTrackballCamera.newInstance());

      window.addEventListener('resize', this.handleResize);

      // create orientation widget
      this.orientationWidget = new OrientationMarker(this.interactor);

      this.initialized = true;
    }

    if (container.current) {
      const contSize = container.current.getBoundingClientRect();
      this.glWindow.setSize(contSize.width, contSize.height);
    }

    if (!prevProps.volumeData && this.props.volumeData) {
      console.log(`volumeData Added`);

      // set volume to Actor
      const volumeActor = new VolumeActor3D();
      volumeActor.setVolumeData(this.props.volumeData);
      this.actors.push(volumeActor);

      this.renderer.addVolume(volumeActor.getActor());
      this.renderer.resetCamera();
      this.renderer.resetCameraClippingRange(false);
      this.renderer.getActiveCamera().setThicknessFromFocalPoint(200);
      this.renderer.getActiveCamera().zoom(1.2);
      this.renderer.getActiveCamera().setFocalPoint(0, 0, 0);
      this.renderer.getActiveCamera().setViewUp(0, 1, 0);
      this.renderer.getActiveCamera().azimuth(30.0);
      if (this.orientationWidget) {
        this.orientationWidget.updateMarkerOrientation();
      }

      this.renderWindow.render();
    }

    if (this.props.modelData.length || prevProps.modelData.length < this.props.modelData.length) {
      console.log(`model Data Added ${prevProps.modelData.length} ${this.props.modelData.length}`);

      // set volume to Actor
      const modelActor = new ModelActor3D();
      modelActor.setModelData(this.props.modelData[0]);
      if (prevProps.modelData.length === 0) {
        modelActor.setColor(1, 0, 0);
        modelActor.setPosition(-50, -41, 50);
        modelActor.getActor().rotateX(-90, 0, 0);
      }
      this.actors.push(modelActor);
      this.renderer.addActor(modelActor.getActor());
      this.renderer.resetCamera();
      this.renderWindow.render();
    }
  }

  componentWillUnmount(): void {
    console.log('componentWillUnmount');
    if (this.props.onDestroyed) {
      this.props.onDestroyed();
    }
  }

  getOrientation(): SliceOrientation | undefined {
    return this.props.orientation;
  }

  setModelOpacity(opacity: number): void {
    this.actors.forEach(actor => {
      if (actor.getActorType() === ModelActor3D.getClassType()) {
        (actor as ModelActor3D).setOpacity(opacity);
      }
    });
    this.renderWindow.render();
  }

  setupLeftRulerState(): void {
    this.rulerStateLeft = makeCommonRulerState('left');
    this.rulerStateLeft.trimLength = 'none';
  }

  setupTopRulerState(): void {
    this.rulerStateTop = makeCommonRulerState('top');
  }

  updateImage(): void {
    console.log(`updateImage@View3DVolume`);
    this.renderWindow.render();
  }

  render(): React.ReactElement {
    console.log(`Render@View3DVolume`);

    if (!this.props.volumeData) {
      return <div />;
    }

    const style: React.CSSProperties = {
      width: '100%',
      height: '100%',
      position: 'relative'
    };

    this.setStateRulers();

    return (
      <div style={style}>
        <div ref={container} style={style} />
        <ViewportOverlay botLeft={`Color Mode: ${this.state.coloringMode}`} />
        <div>
          <VTRuler
            ref={this.refRulerTop}
            name={'VTTopRuler'}
            rulerState={this.rulerStateTop}
          />
          <VTRuler
            ref={this.refRulerLeft}
            name={'VTLeftRuler'}
            rulerState={this.rulerStateLeft}
          />
        </div>
      </div>
    );
  }
}
