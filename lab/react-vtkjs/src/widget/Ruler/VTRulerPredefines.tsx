/*
    Copyright (c) Ewoosoft Co., Ltd.
    
    All rights reserved.
*/

import { makeCommonRulerState, VTRulerState } from './VTRulerTypes';

export function makeRulerBottomRight(who: 'bottom' | 'right'): VTRulerState {
  const answer = makeCommonRulerState(who);

  answer.graduationPosition = 'outside';
  answer.lengthPerClient = 1.0;
  answer.trimLength = 'none';
  answer.startMargin = 16;

  return answer;
}

export function makeTightRulerTopRight(who: 'top' | 'right'): VTRulerState {
  const answer = makeCommonRulerState(who);

  answer.graduationPosition = 'outside';
  answer.lengthPerClient = 1.0;
  answer.trimLength = 'none';
  answer.isNumberOn = false;
  answer.longGraduation.isNumberOn = true;
  answer.longGraduation.numberPosition = 'inside';
  answer.longGraduation.isUnitOn = false;

  if (who === 'top') {
    answer.endMargin = 16;
  } else {
    answer.startMargin = 16;
  }

  return answer;
}
