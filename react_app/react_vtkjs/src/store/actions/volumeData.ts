import { createAction } from 'redux-actions';
import { stringify } from 'querystring';

export const localOpenCTActionType = {
  CT_SELECTED: 'local/CT_SELECTED',
  LOAD_CT_START: 'local/LOAD_CT_START',
  LOAD_CT_SUCCEED: 'local/LOAD_CT_SUCCEED',
  LOAD_CT_FAILED: 'local/LOAD_CT_FAILED'
};

export const localSelectCTAction = function(file: FileList) {
  return {
    type: localOpenCTActionType.CT_SELECTED,
    payload: file
  };
};

export const localLoadCTStartAction = function(file: FileList) {
  return {
    type: localOpenCTActionType.LOAD_CT_START,
    payload: file
  };
};

export const localLoadCTSucceedAction = function(imageData: any) {
  return {
    type: localOpenCTActionType.LOAD_CT_SUCCEED,
    payload: imageData
  };
};

export const localLoadCTFailedAction = function(imageData: any | null = null) {
  return {
    type: localOpenCTActionType.LOAD_CT_FAILED,
    payload: imageData
  };
};

// export const actionTypes = {
//   SELECT_CT: "SELECT_CT",
//   OPEN_CT: "OPEN_CT",
//   OPEN_CT_START: "OPEN_CT_START",
//   OPEN_CT_PROGRESS: "OPEN_CT_PREGRESS",
//   OPEN_CT_SUCCESS: "OPEN_CT_SUCCESS",
//   OPEN_CT_FAILURE: "OPEN_CT_FAILURE"
// };

// export const selectCTAction = createAction(
//   actionTypes.SELECT_CT,
//   (files: FileList) => ({ files })
// );

// export const openCTAction = createAction(actionTypes.OPEN_CT);

// export const openCTStartAction = createAction(actionTypes.OPEN_CT_START);

// export const openCTProgressAction = createAction(
//   actionTypes.OPEN_CT_PROGRESS,
//   (progress: number) => ({ progress })
// );

// export const openCTSuccessAction = createAction(actionTypes.OPEN_CT_SUCCESS);
// export const openCTFailedAction = createAction(
//   actionTypes.OPEN_CT_FAILURE,
//   (error: string) => ({ error })
// );
