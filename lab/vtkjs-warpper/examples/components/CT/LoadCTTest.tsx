/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from 'react';
import { ESVtkCTViewerContainer } from '../../../src';
import {
  CTViewerLayout,
  IActionProperty,
  IViewportApis,
  ActionType,
  IImageAdjustProperty,
} from '../../../src/common/types';

const fileCount = 100;

const getCTFilepath = (): string[] => {
  const filelist: string[] = [];

  for (let i = 0; i < fileCount; i += 1) {
    const padded = i.toString(10).padStart(3, '0');
    const filepath = `testdata/volume/ct1/Reformatted_${padded}.dcm`;
    filelist.push(filepath);
  }

  return filelist;
};

const getPromiseArray = (): Promise<ArrayBuffer>[] => {
  const fileList = getCTFilepath();
  const promiseArray: Promise<ArrayBuffer>[] = [];
  for (let i = 0; i < fileCount; i += 1) {
    const promise = new Promise<ArrayBuffer>((resolve, reject) => {
      // load CT file in public directory as array buffer.
      fetch(fileList[i])
        .then((res) => {
          res
            .arrayBuffer()
            .then((buffer: ArrayBuffer) => {
              resolve(buffer);
            })
            .catch((err) => {
              reject(err);
            });
        })
        .catch((err) => {
          reject(err);
        });
    });
    promiseArray.push(promise);
  }

  return promiseArray;
};

// eslint-disable-next-line @typescript-eslint/no-unused-vars, no-unused-vars
const CT_FILE = 'testdata/ignored/CT20160217_161446_6460_02000273/DCM_FILE.CT';

function LoadCTTest(): React.ReactElement {
  const [data, setData] = useState<string[] | FileList | ArrayBuffer[] | string>('');
  const [width, setWidth] = useState<number>(600);
  const [height, setHeight] = useState<number>(600);
  const [actionType, setActionType] = useState<ActionType>(ActionType.None);
  const [layout, setLayout] = useState<CTViewerLayout>(CTViewerLayout.LayoutMPR);
  const [widthRange, setWidthRange] = useState<{ min: number; max: number }>({ min: 0, max: 100 });
  const [levelRange, setLevelRange] = useState<{ min: number; max: number }>({ min: 0, max: 100 });
  const [imageAdjust, setImageAdjust] = useState<IImageAdjustProperty>({
    smooth: false,
    sharpen: false,
    maxSharpen: false,
    inverse: false,
    mip: false,
    windowLevel: 0,
    windowWidth: 100,
  });

  useEffect(() => {
    // setData(CT_FILE);
    const promiseArray = getPromiseArray();
    Promise.all(promiseArray)
      .then((result) => {
        setData(result);
      })
      .catch((err) => {
        // eslint-disable-next-line no-alert
        alert(`Failed to get resourct CT File - ${err}`);
        setData([]);
      });
  }, []);

  const style: React.CSSProperties = {
    width: '700px',
    height: '800px',
    position: 'relative',
  };

  function getCTFile(e: React.ChangeEvent<HTMLInputElement>): void {
    const { files } = e.target;
    if (files) {
      setData(files);
    }
  }

  const onChangeWidth = (e): void => {
    // eslint-disable-next-line radix
    setWidth(parseInt(e.target.value));
  };

  const onChangeHeight = (e): void => {
    // eslint-disable-next-line radix
    setHeight(parseInt(e.target.value));
  };

  const onButtonClickMPR = (): void => {
    setLayout(CTViewerLayout.LayoutMPR);
  };
  const onButtonClickOblique = (): void => {
    setLayout(CTViewerLayout.LayoutOblique);
  };
  const onButtonClick3DPAN = (): void => {
    setLayout(CTViewerLayout.Layout3DPAN);
  };

  const onButtonClickZomming = (): void => {
    setActionType(ActionType.Zooming);
  };
  const onButtonClickPanning = (): void => {
    setActionType(ActionType.Panning);
  };
  const onButtonClickLength = (): void => {
    setActionType(ActionType.Length);
  };

  const onButtonClickImplant = (): void => {
    setActionType(ActionType.Implant);
  };

  const onButtonClickCrown = (): void => {
    setActionType(ActionType.Crown);
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onStart = (viewportApis: IViewportApis): void => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onFinish = (): void => {
    setActionType(ActionType.None);
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onError = (errorCode: number): void => {};

  const onViewerActivated = (): void => {
    // do nothing.
  };

  const actionProp: IActionProperty = {
    actionType,
    onStart,
    onFinish,
    onError,
    onViewerActivated,
  };

  return (
    <div style={style}>
      <p>
        Select DICOM File:
        <input type="file" multiple accept=".dcm" onChange={getCTFile} />
      </p>
      <button onClick={onButtonClickMPR}> MPR </button>
      <button onClick={onButtonClickOblique}> Oblique </button>
      <button onClick={onButtonClick3DPAN}> 3D Pan </button>
      <p>
        {'Layout Width : '}
        {width}
        {' px'}
        <input type="range" value={width} min="300" max="1000" onChange={onChangeWidth} />
      </p>
      <p>
        {'Layout Height : '}
        {height}
        {' px'}
        <input type="range" value={height} min="300" max="1000" onChange={onChangeHeight} />
      </p>

      <button onClick={onButtonClickZomming}> Zooming </button>
      <button onClick={onButtonClickPanning}> Panning </button>
      <button onClick={onButtonClickLength}> Length </button>
      <button onClick={onButtonClickImplant}> Implant </button>
      <button onClick={onButtonClickCrown}> Crown </button>
      <div style={{ position: 'relative', left: '0px', top: '0px' }}>
        <ESVtkCTViewerContainer
          id="CTViewer"
          size={{ width, height }}
          layoutType={layout}
          data={data}
          active={false}
          actionProp={actionProp}
        />
      </div>
    </div>
  );
}

export default LoadCTTest;
