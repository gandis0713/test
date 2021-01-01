import React, { useEffect } from 'react';
import vtkOpenGLRenderWindow from '../../vtk.js/Sources/Rendering/OpenGL/RenderWindow';
import vtkESRenderer from '../../vtk.js/Sources/Rendering/Core/ESRenderer';
import vtkRenderWindow from '../../vtk.js/Sources/Rendering/Core/RenderWindow';
import vtkRenderWindowInteractor from '../../vtk.js/Sources/Rendering/Core/RenderWindowInteractor';
import vtkInteractorStyleMPR from '../../vtk.js/Sources/Interaction/Style/InteractorStyleMPR';
import vtkPlane from 'vtk.js/Sources/Common/DataModel/Plane';

import vtkMatrixBuilder from 'vtk.js/Sources/Common/Core/MatrixBuilder';

import vtkMPRAxisWidget from '../../vtk.js/Sources/Widgets/Widgets3D/MPRAxisWidget';
import vtkWidgetManager from '../../vtk.js/Sources/Widgets/Core/WidgetManager';
import vtkImageMapper from 'vtk.js/Sources/Rendering/Core/ImageMapper';
import vtkESVolumeMapper from '../../vtk.js/Sources/Rendering/Core/ESVolumeMapper';
import vtkCustomPass from '../../vtk.js/Sources/Rendering/Core/SceneGraph/CustomPass';
import vtkVolume from 'vtk.js/Sources/Rendering/Core/Volume';
import vtkImageReslice from 'vtk.js/Sources/Imaging/Core/ImageReslice';
import vtkImageSlice from 'vtk.js/Sources/Rendering/Core/ImageSlice';
import * as vtkMath from 'vtk.js/Sources/Common/Core/Math';

import { ViewTypes, CaptureOn } from 'vtk.js/Sources/Widgets/Core/WidgetManager/Constants';
import openXmlVtiFile from '../../src/common/DicomReader';

function ClipVolume() {
  useEffect(() => {
    const renderWindow = vtkRenderWindow.newInstance();
    const glWindow = vtkOpenGLRenderWindow.newInstance();
    glWindow.setSize(600, 600);
    const customPass = vtkCustomPass.newInstance();
    glWindow.setRenderPasses([customPass]);
    renderWindow.addView(glWindow);
    const interactor = vtkRenderWindowInteractor.newInstance();
    renderWindow.setInteractor(interactor);
    const container = document.getElementById('reslice');
    glWindow.setContainer(container);
    interactor.setView(glWindow);
    interactor.initialize();
    interactor.bindEvents(container);
    const interactorStyle = vtkInteractorStyleMPR.newInstance();
    interactor.setInteractorStyle(interactorStyle);

    interactorStyle.onRotateEvent(callData => {
      switch (callData.type) {
        case 'RotateEvent':
          break;
        case 'StartRotateEvent':
          break;
        case 'EndRotateEvent':
          break;
      }
    });

    // ----------------------------------------------------------------------------
    // Setup rendering code
    // ----------------------------------------------------------------------------

    const renderer = vtkESRenderer.newInstance();
    const volume = vtkVolume.newInstance();
    const volumeMapper = vtkESVolumeMapper.newInstance();
    const xMaxDim = 123 * 0.8;
    const xMinDim = 0 * 0.8;
    const yMaxDim = 123 * 0.8;
    const yMinDim = 0 * 0.8;
    const zMaxDim = 99 * 0.8;
    const zMinDim = 0 * 0.8;

    // const xMaxDim = 123;
    // const xMinDim = 0;
    // const yMaxDim = 123;
    // const yMinDim = 0;
    // const zMaxDim = 99;
    // const zMinDim = 0;

    // const xMaxDim = 90 * 0.8;
    // const xMinDim = 20 * 0.8;
    // const yMaxDim = 90 * 0.8;
    // const yMinDim = 20 * 0.8;
    // const zMaxDim = 80 * 0.8;
    // const zMinDim = 20 * 0.8;

    let rightNormal = [1, 0, 0];
    let leftNormal = [-1, 0, 0];
    let topNormal = [0, 1, 0];
    let bottomNormal = [0, -1, 0];
    let nearNormal = [0, 0, 1];
    let farNormal = [0, 0, -1];

    let maxOrigin = [xMaxDim, yMaxDim, zMaxDim];
    let minOrigin = [xMinDim, yMinDim, zMinDim];

    const rotationNormal = [0, 0, 1];
    const degree = 45;
    const radian = (degree * Math.PI) / 180;

    rightNormal = vtkMath.rotateVector(rightNormal, rotationNormal, radian);
    leftNormal = vtkMath.rotateVector(leftNormal, rotationNormal, radian);
    topNormal = vtkMath.rotateVector(topNormal, rotationNormal, radian);
    bottomNormal = vtkMath.rotateVector(bottomNormal, rotationNormal, radian);
    nearNormal = vtkMath.rotateVector(nearNormal, rotationNormal, radian);
    farNormal = vtkMath.rotateVector(farNormal, rotationNormal, radian);

    vtkMatrixBuilder
      .buildFromRadian()
      .rotate(radian, rotationNormal)
      .apply(maxOrigin);

    vtkMatrixBuilder
      .buildFromRadian()
      .rotate(radian, rotationNormal)
      .apply(minOrigin);

    const rightPlane = vtkPlane.newInstance();
    rightPlane.setNormal(rightNormal);
    rightPlane.setOrigin(maxOrigin);
    const leftPlane = vtkPlane.newInstance();
    leftPlane.setNormal(leftNormal);
    leftPlane.setOrigin(minOrigin);
    const topPlane = vtkPlane.newInstance();
    topPlane.setNormal(topNormal);
    topPlane.setOrigin(maxOrigin);
    const bottomPlane = vtkPlane.newInstance();
    bottomPlane.setNormal(bottomNormal);
    bottomPlane.setOrigin(minOrigin);
    const nearPlane = vtkPlane.newInstance();
    nearPlane.setNormal(nearNormal);
    nearPlane.setOrigin(maxOrigin);
    const farPlane = vtkPlane.newInstance();
    farPlane.setNormal(farNormal);
    farPlane.setOrigin(minOrigin);
    volumeMapper.addClippingPlane(rightPlane);
    volumeMapper.addClippingPlane(leftPlane);
    volumeMapper.addClippingPlane(topPlane);
    volumeMapper.addClippingPlane(bottomPlane);
    volumeMapper.addClippingPlane(nearPlane);
    volumeMapper.addClippingPlane(farPlane);

    volume.setMapper(volumeMapper);
    renderer.addVolume(volume);
    renderer.setViewType(ViewTypes.VOLUME);

    renderer.setViewport(0, 0.5, 0.5, 1.0);

    const viewUp = [1, 1, 0];
    vtkMath.normalize(viewUp);
    const camera = renderer.getActiveCamera();
    // camera.setViewUp(viewUp);
    camera.setParallelProjection(true);
    // console.log('camera : ', camera.getViewUp());
    renderWindow.addRenderer(renderer);

    // ----------------------------------------------------------------------------
    // Load image
    // ----------------------------------------------------------------------------

    openXmlVtiFile('/assets/volumes/dicom.vti').then(imageData => {
      volumeMapper.setInputData(imageData);

      volumeMapper.setSampleDistance(0.8);

      volume
        .getProperty()
        .getRGBTransferFunction(0)
        .setMappingRange(-1250, 4250);
      volumeMapper.setBlendModeToMaximumIntensity();
      renderer.resetCamera();
      renderWindow.render();
    });
  }, []);
  return (
    <div>
      <div id="reslice" style={{ width: 600, height: 600 }} />
    </div>
  );
}

export default ClipVolume;
