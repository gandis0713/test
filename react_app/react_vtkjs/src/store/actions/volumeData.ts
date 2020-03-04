// import { createAction } from 'redux-actions';
import { createAction, ActionType, createReducer } from 'typesafe-actions';

export const actionTypes = {
  SELECT_CT: 'SELECT_CT',
  OPEN_CT: 'OPEN_CT',
  OPEN_CT_START: 'OPEN_CT_START',
  OPEN_CT_PROGRESS: 'OPEN_CT_PREGRESS',
  OPEN_CT_SUCCESS: 'OPEN_CT_SUCCESS',
  OPEN_CT_FAILURE: 'OPEN_CT_FAILURE'
};

export const selectCTAction = createAction(actionTypes.SELECT_CT)<FileList>();

export const openCTAction = createAction(actionTypes.OPEN_CT)<string>();

export const openCTStartAction = createAction(actionTypes.OPEN_CT_START)<
  string
>();

export const openCTProgressAction = createAction(
  actionTypes.OPEN_CT_PROGRESS
  // (progress: number) => ({ progress })
)<number>();

export const openCTSuccessAction = createAction(actionTypes.OPEN_CT_SUCCESS)<
  string
>();
export const openCTFailedAction = createAction(
  actionTypes.OPEN_CT_FAILURE
  // (error: string) => ({ error })
)<string>();

const actions = {
  selectCTAction,
  openCTAction,
  openCTStartAction,
  openCTProgressAction,
  openCTSuccessAction,
  openCTFailedAction
};
export type OpenCTActions = ActionType<typeof actions>;
