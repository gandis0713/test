import { createAction } from 'redux-actions';

export const actionTypes = {
  SELECT_CT: 'SELECT_CT',
  OPEN_CT_START: 'OPEN_CT_START',
  LOADING_CT: 'OPEN_CT_PROGRESS',
  OPEN_CT_SUCCESS: 'OPEN_CT_SUCCESS',
  OPEN_CT_FAILURE: 'OPEN_CT_FAILURE'
};

export const selectCTAction = createAction(actionTypes.SELECT_CT, (files: FileList) => ({ files }));

export const openCTStartAction = createAction(actionTypes.OPEN_CT_START);

export const loadingCTAction = createAction(actionTypes.LOADING_CT, (progress: number) => ({
  progress
}));

export const openCTSuccessAction = createAction(actionTypes.OPEN_CT_SUCCESS);
export const openCTFailedAction = createAction(actionTypes.OPEN_CT_FAILURE, (error: string) => ({
  error
}));
