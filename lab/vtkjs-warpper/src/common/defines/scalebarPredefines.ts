/* eslint-disable import/prefer-default-export */
import { IScalebarProperty, makeScalebarProperty, ScalebarPosition } from '@ewoosoft/es-scalebar';

export function makeDefault2DScalebarProperties(): IScalebarProperty[] {
  const scalebarProperties = [] as IScalebarProperty[];

  const topBar = makeScalebarProperty(ScalebarPosition.Top);
  topBar.lengthPerClient = 0.7;
  scalebarProperties.push(topBar);

  const leftBar = makeScalebarProperty(ScalebarPosition.Left);
  leftBar.lengthPerClient = 0.7;
  scalebarProperties.push(leftBar);

  return scalebarProperties;
}
