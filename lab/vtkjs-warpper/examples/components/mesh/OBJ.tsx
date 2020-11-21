/* eslint-disable react/button-has-type */
import React, { useState } from 'react';
import { ESVtkOBJModelViewer } from '../../../src';
import { ActionType, IModelViewActionProperty, IViewportApis } from '../../../src/common/types';

function OBJView(): React.ReactElement {
  const [actionType, setActionType] = useState<ActionType>(ActionType.None);

  const style: React.CSSProperties = {
    width: '600px',
    height: '600px',
    position: 'relative',
  };

  const onButtonClickZomming = (): void => {
    setActionType(ActionType.Zooming);
  };
  const onButtonClickPanning = (): void => {
    setActionType(ActionType.Panning);
  };
  const onButtonClickNone = (): void => {
    setActionType(ActionType.None);
  };
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onStart = (viewportApis: IViewportApis): void => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onFinish = (): void => {};

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  const onError = (errorCode: number): void => {};

  const actionProp: IModelViewActionProperty = {
    actionType,
    onStart,
    onFinish,
    onError,
  };

  return (
    <div style={style}>
      <button onClick={onButtonClickZomming}> Zooming </button>
      <button onClick={onButtonClickPanning}> Panning </button>
      <button onClick={onButtonClickNone}> None </button>
      <div style={{ position: 'relative', left: '0px', top: '0px' }}>
        <ESVtkOBJModelViewer
          id="OBJviewer"
          obj="/testdata/mesh/obj/DCT0000.obj"
          mtl="/testdata/mesh/obj/DCT0000.mtl"
          size={{ width: 600, height: 600 }}
          actionProp={actionProp}
        />
      </div>
    </div>
  );
}

export default OBJView;
