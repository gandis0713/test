import React from 'react';
import { Provider } from 'react-redux';
import { ISize } from '@ewoosoft/es-common-types';
import store from '../../store/configureStore';
import CTViewerController from './CTViewerController';
import { CTViewerLayout, IImageAdjustProperty, IActionProperty } from '../../common/types';

export interface ICTViewerContainerProps {
  id: string;
  data: string | string[] | FileList | ArrayBuffer[] | Blob[];
  size: ISize;
  layoutType: CTViewerLayout;
  active: boolean;
  adjustProp?: IImageAdjustProperty;
  actionProp?: IActionProperty;
}

export function ESVtkCTViewerContainer(props: ICTViewerContainerProps): React.ReactElement {
  const { id, data, size, layoutType, active, adjustProp, actionProp } = props;
  return (
    <Provider store={store}>
      <CTViewerController
        id={id}
        data={data}
        size={size}
        layoutType={layoutType}
        active={active}
        adjustProp={adjustProp}
        actionProp={actionProp}
      />
    </Provider>
  );
}
