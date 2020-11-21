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

import OrientationMarker from '../ViewportOverlay/OrientationMarker';
import VolumeActor3D from '../../vtkActor/VolumeActor3D';
import ModelActor3D from '../../vtkActor/ModelActor3D';
import AbstractActor from '../../vtkActor/AbstractActor';

import { SliceOrientation } from '../CommonDefines';

import VTRuler from '../../../widget/Ruler/VTRuler';
import {
  makeCommonRulerState, makeParentViewState, VTRulerState
} from '../../../widget/Ruler/VTRulerTypes';

export enum ToolType {
  eToolNone,
  eToolLength,
  eToolAngle,
  eToolCurve
}

export interface View3DRulerApis {
  uid: string;
  // container: HTMLDivElement | null;
  _component: React.Component;
  getOrientation: () => SliceOrientation | undefined;
  setModelOpacity: (opacity: number) => void;
  setVRColoring: (mode: string) => void;
  setGradDirection: (direction: 'inside' | 'outside') => void;
  setMainNumberPos: (position: string) => void;
  setRulerMargin: (margin: number) => void;
  setMainUnitOn: (flag: boolean) => void;
  setGraduationUnitOn: (flag: boolean) => void;
  setRulerTrim: (trim: 'none' | 'long' | 'middle' | 'short') => void;
  setGraduationNumber: (option: string) => void;
  type: string;
}

interface View3DRulerProps {
  volumeData: vtkImageData;
  modelData: vtkPolyData[];
  orientation?: SliceOrientation;
  onDestroyed?: () => void;
  onCreated?: (api3D: View3DRulerApis) => void;
}

interface ViewState {
  coloringMode: string;
}

const container = React.createRef<HTMLDivElement>();

export default class View3DRulerActor extends Component<View3DRulerProps, ViewState> {
  private renderer: vtkRenderer;

  private renderWindow: vtkRenderWindow;

  private glWindow: vtkOpenGLRenderWindow;

  private interactor: vtkRenderWindowInteractor;

  private actors: AbstractActor[];

  private initialized: boolean;

  private orientationWidget: OrientationMarker | null = null;

  private rulerStateLeft = {} as VTRulerState;
  private rulerStateTop = {} as VTRulerState;
  private rulerStateRight = {} as VTRulerState;
  private rulerStateBottom = {} as VTRulerState;
  private refRulerLeft = React.createRef<VTRuler>();
  private refRulerTop = React.createRef<VTRuler>();
  private refRulerRight = React.createRef<VTRuler>();
  private refRulerBottom = React.createRef<VTRuler>();

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
    this.setGradDirection = this.setGradDirection.bind(this);
    this.setMainNumberPos = this.setMainNumberPos.bind(this);
    this.setRulerMargin = this.setRulerMargin.bind(this);
    this.setMainUnitOn = this.setMainUnitOn.bind(this);
    this.setGraduationUnitOn = this.setGraduationUnitOn.bind(this);
    this.setRulerTrim = this.setRulerTrim.bind(this);
    this.setGraduationNumber = this.setGraduationNumber.bind(this);

    this.setupLeftRulerState();
    this.setupTopRulerState();
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
      const api: View3DRulerApis = {
        uid, // Tracking id available on `api`
        // container: container.current,
        _component: this,
        getOrientation: this.getOrientation,
        setModelOpacity: this.setModelOpacity,
        setVRColoring: this.setVRColoring,
        setGradDirection: this.setGradDirection,
        setMainNumberPos: this.setMainNumberPos,
        setRulerMargin: this.setRulerMargin,
        setMainUnitOn: this.setMainUnitOn,
        setGraduationUnitOn: this.setGraduationUnitOn,
        setRulerTrim: this.setRulerTrim,
        setGraduationNumber: this.setGraduationNumber,
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
    if (this.refRulerRight.current) {
      this.refRulerRight.current.setState(parentViewState);
    }
    if (this.refRulerBottom.current) {
      this.refRulerBottom.current.setState(parentViewState);
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

  setGradDirection(direction: 'inside' | 'outside') {
    this.rulerStateTop.graduationPosition = direction;
    this.rulerStateBottom.graduationPosition = direction;
    this.rulerStateRight.graduationPosition = direction;
    this.rulerStateLeft.graduationPosition = direction;

    this.render();
  }

  setRulerMargin(newMargin: number) {
    this.rulerStateTop.positionMargin = newMargin;
    this.rulerStateBottom.positionMargin = newMargin;
    this.rulerStateRight.positionMargin = newMargin;
    this.rulerStateLeft.positionMargin = newMargin;

    this.render();
  }

  setRulerTrim(trim: 'none' | 'long' | 'middle' | 'short') {
    this.rulerStateTop.trimLength = trim;
    this.rulerStateBottom.trimLength = trim;
    this.rulerStateRight.trimLength = trim;
    this.rulerStateLeft.trimLength = trim;

    this.render();
  }

  setMainUnitOn(flag: boolean) {
    this.rulerStateTop.isUnitOn = flag;
    this.rulerStateBottom.isUnitOn = flag;
    this.rulerStateRight.isUnitOn = flag;
    this.rulerStateLeft.isUnitOn = flag;

    this.render();
  }

  setGraduationUnitOn(flag: boolean) {
    this.rulerStateTop.longGraduation.isUnitOn = flag;
    this.rulerStateBottom.longGraduation.isUnitOn = flag;
    this.rulerStateRight.longGraduation.isUnitOn = flag;
    this.rulerStateLeft.longGraduation.isUnitOn = flag;

    this.render();
  }

  setGraduationNumber(option: string) {
    let on: boolean;
    let location: 'inside' | 'outside';
    let trim: boolean;

    switch (option) {
      case 'none':
      default:
        on = false;
        trim = true;
        location = 'inside';
        break;
      case 'inside':
        on = true;
        trim = false;
        location = 'inside';
        break;
      case 'insideTrim':
        on = true;
        trim = true;
        location = 'inside';
        break;
      case 'outside':
        on = true;
        trim = false;
        location = 'outside';
        break;
      case 'outsideTrim':
        on = true;
        trim = true;
        location = 'outside';
        break;
    }

    this.rulerStateTop.longGraduation.isNumberOn = on;
    this.rulerStateBottom.longGraduation.isNumberOn = on;
    this.rulerStateRight.longGraduation.isNumberOn = on;
    this.rulerStateLeft.longGraduation.isNumberOn = on;

    this.rulerStateTop.longGraduation.numberPosition = location;
    this.rulerStateBottom.longGraduation.numberPosition = location;
    this.rulerStateRight.longGraduation.numberPosition = location;
    this.rulerStateLeft.longGraduation.numberPosition = location;

    this.rulerStateTop.longGraduation.isNumberRulerRangeOnly = trim;
    this.rulerStateBottom.longGraduation.isNumberRulerRangeOnly = trim;
    this.rulerStateRight.longGraduation.isNumberRulerRangeOnly = trim;
    this.rulerStateLeft.longGraduation.isNumberRulerRangeOnly = trim;

    this.render();
  }

  setMainNumberPos(position: string) {
    let pos: 'start' | 'end';
    let set: boolean;

    switch (position) {
      case 'start':
        pos = 'start';
        set = true;
        break;
      case 'end':
        pos = 'end';
        set = true;
        break;
      default:
        pos = 'end';
        set = false;
        break;
    }

    this.rulerStateTop.numberPosition = pos;
    this.rulerStateBottom.numberPosition = pos;
    this.rulerStateRight.numberPosition = pos;
    this.rulerStateLeft.numberPosition = pos;

    this.rulerStateTop.isNumberOn = set;
    this.rulerStateBottom.isNumberOn = set;
    this.rulerStateRight.isNumberOn = set;
    this.rulerStateLeft.isNumberOn = set;

    this.render();
  }

  componentDidUpdate(prevProps: View3DRulerProps): void {
    console.log('componentDidUpdate@View3DRuler');

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

  setupRightRulerState(): void {
    this.rulerStateRight = makeCommonRulerState('right');
    this.rulerStateRight.trimLength = 'none';
  }

  setupBottomRulerState(): void {
    this.rulerStateBottom = makeCommonRulerState('bottom');
  }

  updateImage(): void {
    console.log(`updateImage@View3DRuler`);
    this.renderWindow.render();
  }

  render(): React.ReactElement {
    console.log(`Render@View3DRuler`);

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
        <div>
          <VTRuler
            ref={this.refRulerTop}
            name={'VTTopRuler'}
            rulerState={this.rulerStateTop}
          />
          <VTRuler
            ref={this.refRulerBottom}
            name={'VTBottomRuler'}
            rulerState={this.rulerStateBottom}
          />
          <VTRuler
            ref={this.refRulerLeft}
            name={'VTLeftRuler'}
            rulerState={this.rulerStateLeft}
          />
          <VTRuler
            ref={this.refRulerRight}
            name={'VTRightRuler'}
            rulerState={this.rulerStateRight}
          />
        </div>
      </div>
    );
  }
}
