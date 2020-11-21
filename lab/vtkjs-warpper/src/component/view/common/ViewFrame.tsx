import React, { CSSProperties, useState } from 'react';
import { ISize, IPoint } from '@ewoosoft/es-common-types';
import { EventType, ViewType } from '../../../common/defines';
import ViewTitle from './ViewTitle';
import {
  getViewFrameHoverColor,
  getViewFrameNormalColor,
} from '../../../common/utility/colorUtility';

export interface IViewTitleProps {
  viewType: ViewType;
  position: IPoint;
  size: ISize;
  children: React.ReactElement;
}

export default function ViewFrame(props: IViewTitleProps): React.ReactElement {
  const { viewType, position, size, children } = props;
  const [entered, setEntered] = useState<boolean>(false);

  const onMouseEvent = (event: React.MouseEvent<HTMLElement>): void => {
    const { type } = event;
    switch (type) {
      case EventType.MouseEnter:
        setEntered(true);
        break;
      case EventType.MouseLeave:
        setEntered(false);
        break;
      default:
        break;
    }
  };

  const borderSize = 2;

  const viewStyle: CSSProperties = {
    position: 'absolute',
    left: `${position.x}px`,
    top: `${position.y}px`,
    width: size.width,
    height: size.height,
    border:
      entered === true
        ? `${borderSize}px solid ${getViewFrameHoverColor(viewType)}`
        : `${borderSize}px solid ${getViewFrameNormalColor(viewType)}`,
  };

  return (
    <div onMouseEnter={onMouseEvent} onMouseLeave={onMouseEvent}>
      <div style={viewStyle}>
        <ViewTitle viewType={viewType} entered={entered} />
        {children}
      </div>
    </div>
  );
}
