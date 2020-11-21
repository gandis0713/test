/* eslint-disable import/no-named-as-default-member */
/* eslint-disable react/destructuring-assignment */
import React, { Component } from 'react';
import vtkRenderer from 'vtk.js/Sources/Rendering/Core/Renderer';
import vtkRenderWindow from 'vtk.js/Sources/Rendering/Core/RenderWindow';

import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';

import vtkRenderWindowInteractor from 'vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkOpenGLRenderWindow from 'vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkVolumeMapper from 'vtk.js/Sources/Rendering/Core/VolumeMapper';
import vtkWidgetManager from 'vtk.js/Sources/Widgets/Core/WidgetManager';
import vtkBoundingBox from 'vtk.js/Sources/Common/DataModel/BoundingBox';
import { vec3 } from 'gl-matrix';
import {
  TextAlign,
  VerticalAlign
} from 'vtk.js/Sources/Interaction/Widgets/LabelRepresentation/Constants';
import { ViewTypes } from 'vtk.js/Sources/Widgets/Core/WidgetManager/Constants';

import cuid from 'cuid';
import vtkInteractorStyleMPRSlice from '../../vtkInteraction/vtkInteractorStyleMPRSlice';
import vtkDistanceWidget from '../../vtkWidgets/DistanceWidget';
import vtkAngleWidget from '../../vtkWidgets/AngleWidget';
import vtkSplineWidget from '../../vtkWidgets/SplineWidget';

import { SliceOrientation, Windowing } from '../CommonDefines';

import VTRuler from '../../../widget/Ruler/VTRuler';
import {
  makeParentViewState, VTRulerState
} from '../../../widget/Ruler/VTRulerTypes';
import {
  makeTightRulerTopRight
} from '../../../widget/Ruler/VTRulerPredefines';

export enum ToolType {
  eToolNone,
  eToolLength,
  eToolAngle,
  eToolCurve
}

export interface View2DRulerApis {
  uid: string;
  container: HTMLDivElement | null;
  _component: React.Component;
  updateImage: () => void;
  getOrientation: () => SliceOrientation | undefined;
  setSlice: (slice: number) => void;
  setSelectedTool: (eToolType: ToolType) => void;
  ResetCurve: () => void;
  type: string;
}

interface View2DRulerProps {
  volumeData: vtkImageData;
  sliceRange: number[];
  currentSlice: number;
  orientation?: SliceOrientation;
  onDestroyed?: () => void;
  onCreated?: (api2D: View2DRulerApis) => void;
  onIStyleUpdated?: (rangeMax: number, currentSlice: number) => void;
}

interface ViewState {
  windowing: Windowing;
}

export default class View2DRuler extends Component<View2DRulerProps, ViewState> {
  private renderer: vtkRenderer;

  private measureRenderer: vtkRenderer;

  private renderWindow: vtkRenderWindow;

  private glWindow: vtkOpenGLRenderWindow;

  private interactor: vtkRenderWindowInteractor;

  private istyle: vtkInteractorStyleMPRSlice;

  private volumeActor: vtkVolume | null;

  private volumeMapper: vtkVolumeMapper | null;

  private widgetManager: vtkWidgetManager;

  private distanceWidget: vtkDistanceWidget;

  private distHandle: any;

  private angleWidget: vtkAngleWidget;

  private angleHandle: any;

  private splineWidget: typeof vtkSplineWidget;

  private splineHandle: any;

  private container: React.RefObject<HTMLDivElement>;

  private rulerStateRight = {} as VTRulerState;
  private rulerStateTop = {} as VTRulerState;
  private refRulerRight = React.createRef<VTRuler>();
  private refRulerTop = React.createRef<VTRuler>();

  constructor(props) {
    super(props);
    this.container = React.createRef<HTMLDivElement>();
    this.state = {
      windowing: { windowLevel: 1500, windowWidth: 5500 }
    };

    this.widgetManager = vtkWidgetManager.newInstance();
    this.istyle = vtkInteractorStyleMPRSlice.newInstance();
    this.distanceWidget = vtkDistanceWidget.newInstance();
    this.angleWidget = vtkAngleWidget.newInstance();
    this.splineWidget = vtkSplineWidget.newInstance();

    this.getOrientation = this.getOrientation.bind(this);
    this.updateImage = this.updateImage.bind(this);
    this.setSlice = this.setSlice.bind(this);
    this.onIStyleModified = this.onIStyleModified.bind(this);
    this.setSelectedTool = this.setSelectedTool.bind(this);
    this.ResetCurve = this.ResetCurve.bind(this);
    this.updateCameras = this.updateCameras.bind(this);

    this.setupRightRulerState();
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
    this.glWindow.setContainer(this.container.current);
    this.renderWindow.addView(this.glWindow);

    this.measureRenderer = vtkRenderer.newInstance();
    this.renderWindow.addRenderer(this.measureRenderer);
    this.renderWindow.setNumberOfLayers(2);
    this.measureRenderer.setLayer(1);
    this.measureRenderer.setInteractive(false);

    this.glWindow.buildPass(true);

    this.volumeActor = vtkVolume.newInstance();
    this.volumeMapper = vtkVolumeMapper.newInstance();
    this.volumeActor.setMapper(this.volumeMapper);

    this.renderer.getActiveCamera().setParallelProjection(true);
    this.measureRenderer.getActiveCamera().setParallelProjection(true);

    if (this.props.onCreated) {
      /**
       * Note: The contents of this Object are
       * considered part of the API contract
       * we make with consumers of this component.
       */
      const api: View2DRulerApis = {
        uid, // Tracking id available on `api`
        container: this.container.current,
        _component: this,
        updateImage: this.updateImage,
        getOrientation: this.getOrientation,
        setSlice: this.setSlice,
        setSelectedTool: this.setSelectedTool,
        ResetCurve: this.ResetCurve,
        type: 'VIEW2D'
      };

      this.props.onCreated(api);
    }
  }

  componentDidUpdate(prevProps: View2DRulerProps): void {
    console.log('componentDidUpdate');

    if (!this.glWindow.getContainer()) {
      console.log(`Add container`);
      this.glWindow.setContainer(this.container.current);
      this.interactor = vtkRenderWindowInteractor.newInstance();
      this.interactor.setView(this.glWindow);
      this.interactor.initialize();
      this.interactor.bindEvents(this.container.current);

      // resize
      const contSize = this.glWindow.getContainer().getBoundingClientRect();
      this.glWindow.setSize(contSize.width, contSize.height);

      this.renderWindow.getInteractor().setInteractorStyle(this.istyle);

      this.widgetManager.disablePicking();
      this.widgetManager.setRenderer(this.measureRenderer);
      this.distHandle = this.widgetManager.addWidget(this.distanceWidget, ViewTypes.SLICE);
      this.angleHandle = this.widgetManager.addWidget(this.angleWidget, ViewTypes.SLICE);

      this.splineHandle = this.widgetManager.addWidget(this.splineWidget, ViewTypes.SLICE);
      this.splineHandle.setClose(false);
      this.splineHandle.setOutputBorder(true);

      if (this.container.current) {
        this.container.current.addEventListener(
          'dblclick',
          this.splineHandle.handleLeftButtonDouble
        );
      }

      // Update Label
      this.distHandle.setLabelTextCallback((worldBounds, screenBounds, labelRep) => {
        const center = vtkBoundingBox.getCenter(screenBounds);
        const radius =
          vec3.distance(center, [screenBounds[0], screenBounds[2], screenBounds[4]]) / 2;

        const position = [0, 0, 0];
        vec3.scaleAndAdd(position, center, [1, 1, 1], radius);
        labelRep.setDisplayPosition(position);

        labelRep.setLabelText(`${this.distanceWidget.getDistance().toFixed(1)}mm`);

        labelRep.setTextAlign(TextAlign.CENTER);
        labelRep.setVerticalAlign(VerticalAlign.CENTER);
      });

      this.renderer.getActiveCamera().setParallelProjection(true);
      this.measureRenderer.getActiveCamera().setParallelProjection(true);

      // Update Label
      this.angleHandle.setLabelTextCallback((centerScreenPos, labelDirection, labelRep) => {
        console.log(`centerScreenPos${centerScreenPos}`);
        const center = centerScreenPos;
        const radius = 30;

        const position = [0, 0, 0];
        vec3.scaleAndAdd(position, center, labelDirection, radius);
        labelRep.setDisplayPosition(position);

        labelRep.setTextAlign(TextAlign.CENTER);
        labelRep.setVerticalAlign(VerticalAlign.CENTER);

        labelRep.setLabelText(`${this.angleWidget.getAngle().toFixed(1)}°`);

        labelRep.updateLabel();
      });

      this.renderer.getActiveCamera().setParallelProjection(true);
      this.measureRenderer.getActiveCamera().setParallelProjection(true);
    }

    if (!prevProps.volumeData && this.props.volumeData) {
      console.log(`volumeData Added`);
      this.volumeMapper.setInputData(this.props.volumeData);

      // set interactor style volume mapper after mapper sets input data
      this.istyle.setVolumeActor(this.volumeActor);
      this.istyle.onModified(this.onIStyleModified);
      this.istyle.setSliceNormal(0, 0, 1);
      this.istyle.setSlice(40);
      this.interactor.requestAnimation(this.istyle); // Elly: Need to force update view.

      this.volumeActor
        .getProperty()
        .getRGBTransferFunction(0)
        .setMappingRange(-1250, 4250);

      this.renderer.addVolume(this.volumeActor);
      this.renderer.resetCamera();
      // TODO unsubscribe from this before component unmounts.
      // this.interactor.onAnimation(this.updateCameras);
      this.updateCameras();

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
    const range = this.istyle.getSliceRange();
    const slice = this.istyle.getSlice();
    if (this.props.onIStyleUpdated) {
      this.props.onIStyleUpdated(range[1], slice);
    }

    this.updateCameras();
  }

  getOrientation(): SliceOrientation | undefined {
    return this.props.orientation;
  }

  setupRightRulerState(): void {
    this.rulerStateRight = makeTightRulerTopRight('right');
  }

  setupTopRulerState(): void {
    this.rulerStateTop = makeTightRulerTopRight('top');
  }

  setSlice(slice: number): void {
    console.log(`setSlice: ${slice}`);
    this.istyle.setSlice(slice);
    this.istyle.setSliceNormal(0, 0, 1);
    this.updateImage();
  }

  setSelectedTool(eToolType: ToolType): void {
    switch (eToolType) {
      case ToolType.eToolLength: {
        console.log('Start Draw Length');
        this.istyle.setEnabled(false);
        this.measureRenderer.setInteractive(true);
        this.widgetManager.enablePicking();
        this.distanceWidget.placeWidget([0, 100, 0, 100, 0, 80]);
        this.widgetManager.grabFocus(this.distanceWidget);
        break;
      }
      case ToolType.eToolAngle: {
        console.log('Start Draw Angle');
        this.istyle.setEnabled(false);
        this.measureRenderer.setInteractive(true);
        this.widgetManager.enablePicking();
        this.angleWidget.placeWidget([0, 100, 0, 100, 0, 80]);
        this.widgetManager.grabFocus(this.angleWidget);
        break;
      }
      case ToolType.eToolCurve: {
        console.log('Start Draw Curve');
        this.istyle.setEnabled(false);
        this.measureRenderer.setInteractive(true);
        this.widgetManager.enablePicking();
        this.splineWidget.placeWidget([0, 100, 0, 100, 0, 80]);
        this.widgetManager.grabFocus(this.splineWidget);
        break;
      }
      default: {
        console.log('Finish Draw Length');
        this.istyle.setEnabled(true);
        this.measureRenderer.setInteractive(false);
        this.widgetManager.releaseFocus();
        this.widgetManager.disablePicking();
        break;
      }
    }
  }

  ResetCurve(): void {
    this.splineHandle.ResetCurve();
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
    if (this.refRulerTop.current) {
      this.refRulerTop.current.setState(parentViewState);
    }
  }

  updateCameras(): void {
    console.log('updateCameras');
    const baseCamera = this.renderer.getActiveCamera();
    console.log(`baseCamera.getViewAngle()${baseCamera.getViewAngle()}`);
    console.log(`baseCamera.getParallelScale()${baseCamera.getParallelScale()}`);
    const widgetCamera = this.measureRenderer.getActiveCamera();
    console.log(`widgetCamera.getViewAngle()${widgetCamera.getViewAngle()}`);
    console.log(`widgetCamera.getParallelScale()${widgetCamera.getParallelScale()}`);

    const position = baseCamera.getReferenceByName('position');
    const focalPoint = baseCamera.getReferenceByName('focalPoint');
    const viewUp = baseCamera.getReferenceByName('viewUp');
    const parallelScale = baseCamera.getReferenceByName('parallelScale');

    widgetCamera.set({
      position,
      focalPoint,
      viewUp,
      parallelScale
    });

    this.distanceWidget.getManipulator().setOrigin(focalPoint);
    this.distanceWidget.getManipulator().setNormal(baseCamera.getDirectionOfProjection());

    this.distHandle.updateRepresentationForRender();
  }

  updateImage(): void {
    console.log(`updateImage@View2DRuler`);
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

    this.setStateRulers();

    return (
      <div style={style}>
        <div ref={this.container} style={style} />
        {this.container.current ?
          <div>
            <VTRuler
              name={'VTTopRuler'}
              rulerState={this.rulerStateTop}
              ref={this.refRulerTop}
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
