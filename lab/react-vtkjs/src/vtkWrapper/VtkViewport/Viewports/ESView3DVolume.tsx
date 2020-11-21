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
import vtkOpenGLRenderWindow from '../../customClass/rendering/opengl/RenderWindow';

import cuid from 'cuid';

import ViewportOverlay from '../ViewportOverlay/ViewportOverlay';
import OrientationMarker from '../ViewportOverlay/OrientationMarker';
import ESVolumeActor3D from '../../vtkActor/ESVolumeActor3D';
import ModelActor3D from '../../vtkActor/ModelActor3D';
import AbstractActor from '../../vtkActor/AbstractActor';

import { SliceOrientation } from '../CommonDefines';
import { openSTLByUrl } from '../../../fileio/openSTLFile';
import ImplantActor from '../../vtkActor/ImplantActor';
import CrownActor from '../../vtkActor/CrownActor';
import { Implant } from '../../../store/reducers/implant';

export interface View3DVolApis {
  uid: string;
  // container: HTMLDivElement | null;
  _component: React.Component;
  getOrientation: () => SliceOrientation | undefined;
  setModelOpacity: (opacity: number) => void;
  setVRColoring: (mode: string) => void;
  setOpacity: (value: number | number[]) => void;
  setBrightness: (value: number | number[]) => void;
  setContrast: (value: number | number[]) => void;
  setImplantPosition: (value: number[]) => void;
  setImplantRotation: (value: number) => void;
  setCrownPosition: (value: number[]) => void;
  setCrownRotation: (value: number) => void;
  type: string;
}

interface View3DVolumeProps {
  volumeData: vtkImageData;
  modelData: vtkPolyData[];
  implantData: Implant[];
  orientation?: SliceOrientation;
  onDestroyed?: () => void;
  onCreated?: (api3D: View3DVolApis) => void;
}

interface ViewState {
  coloringMode: string;
  opacity: number | number[];
  brightness: number | number[];
  contrast: number | number[];
}

const container = React.createRef<HTMLDivElement>();

export default class ESView3DVolume extends Component<View3DVolumeProps, ViewState> {
  private renderer: vtkRenderer;

  private renderWindow: vtkRenderWindow;

  private glWindow: vtkOpenGLRenderWindow;

  private interactor: vtkRenderWindowInteractor;

  private actors: AbstractActor[];

  private initialized: boolean;

  private orientationWidget: OrientationMarker | null = null;

  // container: React.RefObject<HTMLDivElement>;

  constructor(props) {
    super(props);

    this.actors = [];
    this.initialized = false;
    this.state = {
      coloringMode: 'Teeth',
      opacity: 1,
      brightness: 0.0,
      contrast: 0.0
    };
    this.glWindow = vtkOpenGLRenderWindow.newInstance();
    this.getOrientation = this.getOrientation.bind(this);
    this.setModelOpacity = this.setModelOpacity.bind(this);
    this.setVRColoring = this.setVRColoring.bind(this);
    this.setOpacity = this.setOpacity.bind(this);
    this.setBrightness = this.setBrightness.bind(this);
    this.setContrast = this.setContrast.bind(this);
    this.handleResize = this.handleResize.bind(this);
    this.setImplantPosition = this.setImplantPosition.bind(this);
    this.setImplantRotation = this.setImplantRotation.bind(this);
    this.setCrownPosition = this.setCrownPosition.bind(this);
    this.setCrownRotation = this.setCrownRotation.bind(this);
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
        setOpacity: this.setOpacity,
        setBrightness: this.setBrightness,
        setContrast: this.setContrast,
        setImplantPosition: this.setImplantPosition,
        setImplantRotation: this.setImplantRotation,
        setCrownPosition: this.setCrownPosition,
        setCrownRotation: this.setCrownRotation,
        type: 'VIEW3D'
      };

      this.props.onCreated(api);
    }

    this.props.implantData.forEach(implant => {
      openSTLByUrl(implant.file)
        .then((data: vtkPolyData) => {
          const implantActor = new ImplantActor();
          implantActor.setModelData(data);
          implantActor.setColor(1, 0, 0);
          implantActor.setPosition(0, 0, 0);
          implantActor.getActor().rotateX(-90, 0, 0);
          this.actors.push(implantActor);
          this.renderer.addActor(implantActor.getActor());

          if (implant.crown) {
            openSTLByUrl(implant.crown.file)
              .then((data: vtkPolyData) => {
                const crownActor = new CrownActor();
                crownActor.setModelData(data);
                crownActor.setColor(1, 1, 0);
                crownActor.setPosition(0, 0, 0);
                this.actors.push(crownActor);
                this.renderer.addActor(crownActor.getActor());
                implantActor.addChild(crownActor);
              })
              .catch((error: Error) => {
                console.log(error.message);
              });
          }
        })
        .catch((error: Error) => {
          console.log(error.message);
        });
    });
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
      if (actor.getActorType() === ESVolumeActor3D.getClassType()) {
        (actor as ESVolumeActor3D).setVRColoring(mode);
      }
    });
    this.renderWindow.render();
  }

  setOpacity(value: number | number[]) {
    this.setState({
      opacity: value
    });
    this.actors.forEach(actor => {
      if (actor.getActorType() === ESVolumeActor3D.getClassType()) {
        (actor as ESVolumeActor3D).setOpacity(value);
      }
    });
    this.renderWindow.render();
  }

  setBrightness(value: number | number[]) {
    this.setState({
      brightness: value
    });
    this.actors.forEach(actor => {
      if (actor.getActorType() === ESVolumeActor3D.getClassType()) {
        (actor as ESVolumeActor3D).setBrightness(value);
      }
    });
    this.renderWindow.render();
  }

  setContrast(value: number | number[]) {
    this.setState({
      contrast: value
    });
    this.actors.forEach(actor => {
      if (actor.getActorType() === ESVolumeActor3D.getClassType()) {
        (actor as ESVolumeActor3D).setContrast(value);
      }
    });
    this.renderWindow.render();
  }

  componentDidUpdate(prevProps: View3DVolumeProps): void {
    console.log('componentDidUpdate');

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
      // console.log('contSize : ', contSize);
      this.glWindow.setSize(contSize.width, contSize.height);
    }

    if (!prevProps.volumeData && this.props.volumeData) {
      console.log(`volumeData Added`);

      // set volume to Actor
      const volumeActor = new ESVolumeActor3D();
      volumeActor.setVolumeData(this.props.volumeData);
      this.actors.push(volumeActor);

      this.renderer.addVolume(volumeActor.getActor());
      this.renderer.resetCamera();
      this.renderer.resetCameraClippingRange(false);
      // this.renderer.getActiveCamera().setThicknessFromFocalPoint(200);
      this.renderer.getActiveCamera().zoom(1.0);
      // this.renderer.getActiveCamera().zoom(1.2);
      this.renderer.getActiveCamera().setFocalPoint(0, 0, 0);
      this.renderer.getActiveCamera().setViewUp(0, 1, 0);
      // this.renderer.getActiveCamera().azimuth(30.0);
      if (this.orientationWidget) {
        this.orientationWidget.updateMarkerOrientation();
      }

      this.renderWindow.render();
    }

    if (this.props.modelData.length || prevProps.modelData.length < this.props.modelData.length) {
      console.log(`model Data Added ${prevProps.modelData.length} ${this.props.modelData.length}`);

      for (let i = 0; i < this.props.modelData.length; i++) {
        // set volume to Actor
        const modelActor = new ModelActor3D();
        modelActor.setModelData(this.props.modelData[i]);
        modelActor.setColor(1, 0, 0);
        modelActor.setPosition(0, 0, 40);
        modelActor.getActor().rotateX(-90, 0, 0);
        this.actors.push(modelActor);
        this.renderer.addActor(modelActor.getActor());
      }

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

  setImplantPosition(position: number[]): void {
    this.actors.forEach(actor => {
      if (actor.getActorType() === ImplantActor.getClassType()) {
        (actor as ImplantActor).setPosition(position[0], position[1], position[2]);
      }
    });
    this.renderWindow.render();
  }

  setImplantRotation(angle: number): void {
    this.actors.forEach(actor => {
      if (actor.getActorType() === ImplantActor.getClassType()) {
        (actor as ImplantActor).setRotationX(angle);
      }
    });
    this.renderWindow.render();
  }

  setCrownPosition(position: number[]): void {
    this.actors.forEach(actor => {
      if (actor.getActorType() === CrownActor.getClassType()) {
        (actor as CrownActor).setPosition(position[0], position[1], position[2]);
      }
    });
    this.renderWindow.render();
  }

  setCrownRotation(angle: number): void {
    this.actors.forEach(actor => {
      if (actor.getActorType() === CrownActor.getClassType()) {
        (actor as CrownActor).setRotationX(angle);
      }
    });
    this.renderWindow.render();
  }

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
        <div ref={container} style={style} />
        <ViewportOverlay botLeft={`Color Mode: ${this.state.coloringMode}`} />
      </div>
    );
  }
}
