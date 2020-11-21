import React from 'react';
import { ISize } from '@ewoosoft/es-common-types';
import { IScalebarProperty } from '@ewoosoft/es-scalebar';

export interface IAbstractViewerProps {
  id: string;
  size: ISize;
  onMouseDown?: (id: string) => void;
  onMouseEnter?: (id: string) => void;
  onMouseLeave?: (id: string) => void;

  scalebars?: IScalebarProperty[];
}

export default abstract class ESVtkAbstractViewer<
  Props extends IAbstractViewerProps
> extends React.PureComponent<Props> {
  public abstract render(): React.ReactElement;
}
