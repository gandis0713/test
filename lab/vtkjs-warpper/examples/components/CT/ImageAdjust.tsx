/* eslint-disable react/button-has-type */
import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';
// eslint-disable-next-line import/extensions
import { IWindowingRangeProperty } from '../../../src/common/defines/imageAdjust';
import { ESVtkCTViewerContainer, IImageAdjustProperty } from '../../../src';
import {
  CTViewerLayout,
  ActionType,
  IActionProperty,
  IViewportApis,
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

const useStyles = makeStyles(() => ({
  filter: {
    margin: 10,
    cursor: 'pointer',
    backgroundColor: '#e0e0e0',
    fontWeight: 'bold',
  },
  filterNormal: {
    backgroundColor: '#e0e0e0',
  },
  filterSelected: {
    backgroundColor: '#ff0055',
    color: 'white',
  },
}));

function ImageAdjustTest(): React.ReactElement {
  const [data, setData] = useState<string[] | FileList | ArrayBuffer[] | string>('');
  const [actionType] = useState<ActionType>(ActionType.None);
  const [viewerActive, setViewerActive] = useState<boolean>(true);

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

  const onChangeWindowWidth = (e): void => {
    // eslint-disable-next-line radix
    setImageAdjust({ ...imageAdjust, windowWidth: parseInt(e.target.value) });
  };

  const onChangeWindowLevel = (e): void => {
    // eslint-disable-next-line radix
    setImageAdjust({ ...imageAdjust, windowLevel: parseInt(e.target.value) });
  };

  const onButtonClickSmooth = (): void => {
    setImageAdjust({ ...imageAdjust, smooth: !imageAdjust.smooth });
  };
  const onButtonClickSharpen = (): void => {
    setImageAdjust({ ...imageAdjust, sharpen: !imageAdjust.sharpen });
  };
  const onButtonClickMaxSharpen = (): void => {
    setImageAdjust({ ...imageAdjust, maxSharpen: !imageAdjust.maxSharpen });
  };

  const onButtonClickInverse = (): void => {
    setImageAdjust({ ...imageAdjust, inverse: !imageAdjust.inverse });
  };

  const onButtonClickMIP = (): void => {
    setImageAdjust({ ...imageAdjust, mip: !imageAdjust.mip });
  };

  const onButtonClickSelectWindow = (): void => {
    setViewerActive(!viewerActive);
  };

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onStart = (viewportApis: IViewportApis): void => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onFinish = (): void => {};

  const onError = (errorCode: number): void => {
    console.log('ImageCanvasContainer - error ', errorCode);
  };

  const onViewerActivated = (
    imageAdjustProp: IImageAdjustProperty,
    windowingRange: IWindowingRangeProperty
  ): void => {
    setImageAdjust(imageAdjustProp);
    setWidthRange(windowingRange.windowingWidthRange);
    setLevelRange(windowingRange.windowingLevelRange);
  };

  const actionProp: IActionProperty = {
    actionType,
    onStart,
    onFinish,
    onError,
    onViewerActivated,
  };

  const classes = useStyles();

  return (
    <div style={style}>
      <p>
        <button
          className={clsx(classes.filter, {
            [classes.filterNormal]: viewerActive === false,
            [classes.filterSelected]: viewerActive === true,
          })}
          onClick={onButtonClickSelectWindow}
        >
          Select window
        </button>
      </p>
      <button
        className={clsx(classes.filter, {
          [classes.filterNormal]: imageAdjust.smooth === false,
          [classes.filterSelected]: imageAdjust.smooth === true,
        })}
        onClick={onButtonClickSmooth}
      >
        Smooth
      </button>
      <button
        className={clsx(classes.filter, {
          [classes.filterNormal]: imageAdjust.sharpen === false,
          [classes.filterSelected]: imageAdjust.sharpen === true,
        })}
        onClick={onButtonClickSharpen}
      >
        Sharpen
      </button>
      <button
        className={clsx(classes.filter, {
          [classes.filterNormal]: imageAdjust.maxSharpen === false,
          [classes.filterSelected]: imageAdjust.maxSharpen === true,
        })}
        onClick={onButtonClickMaxSharpen}
      >
        Max Sharpen
      </button>
      <button
        className={clsx(classes.filter, {
          [classes.filterNormal]: imageAdjust.inverse === false,
          [classes.filterSelected]: imageAdjust.inverse === true,
        })}
        onClick={onButtonClickInverse}
      >
        Inverse
      </button>
      <button
        className={clsx(classes.filter, {
          [classes.filterNormal]: imageAdjust.mip === false,
          [classes.filterSelected]: imageAdjust.mip === true,
        })}
        onClick={onButtonClickMIP}
      >
        MIP
      </button>
      <p>
        {'Windowing Width : '}
        {imageAdjust.windowWidth}
        <input
          type="range"
          value={imageAdjust.windowWidth}
          min={widthRange.min}
          max={widthRange.max}
          onChange={onChangeWindowWidth}
        />
      </p>
      <p>
        {'Windowing Level : '}
        {imageAdjust.windowLevel}
        <input
          type="range"
          value={imageAdjust.windowLevel}
          min={levelRange.min}
          max={levelRange.max}
          onChange={onChangeWindowLevel}
        />
      </p>
      <div style={{ position: 'relative', left: '0px', top: '0px' }}>
        <ESVtkCTViewerContainer
          id="CTViewer"
          size={{ width: 600, height: 600 }}
          layoutType={CTViewerLayout.LayoutMPR}
          data={data}
          active={viewerActive}
          adjustProp={imageAdjust}
          actionProp={actionProp}
        />
      </div>
    </div>
  );
}
export default ImageAdjustTest;
