import React, { CSSProperties } from 'react';
import { ViewType } from '../../../common/defines';
import {
  getViewFrameNormalColor,
  getViewFrameHoverColor,
  getViewTitleFontNormalColor,
  getViewTitleFontHoverColor,
} from '../../../common/utility/colorUtility';

export interface IViewTitleProps {
  viewType: ViewType;
  entered: boolean;
}

export default function ViewTitle(props: IViewTitleProps): React.ReactElement {
  const { viewType, entered } = props;

  const titleStyle: CSSProperties = {
    position: 'absolute',
    color:
      entered === true
        ? getViewTitleFontHoverColor(viewType)
        : getViewTitleFontNormalColor(viewType),
    backgroundColor:
      entered === true ? getViewFrameHoverColor(viewType) : getViewFrameNormalColor(viewType),
    width: `100px`,
    height: `20px`,
    textAlign: 'center',
    fontSize: 13,
  };

  return <div style={titleStyle}>{viewType}</div>;
}
