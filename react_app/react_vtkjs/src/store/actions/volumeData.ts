export const localOpenCTActionType = {
  CT_SELECTED: 'local/CT_SELECTED',
  LOAD_CT_START: 'local/LOAD_CT_START',
  LOAD_CT_SUCCEED: 'local/LOAD_CT_SUCCEED',
  LOAD_CT_FAILED: 'local/LOAD_CT_FAILED'
};

export const localCTSelectedAction = (file: FileList) => {
  return {
    type: localOpenCTActionType.CT_SELECTED,
    payload: {
      files: file,
      status: localOpenCTActionType.CT_SELECTED,
      error: 0
    }
  };
};

export const localCTSelectCanceledAction = (file: FileList) => {
  return {
    type: localOpenCTActionType.CT_SELECTED,
    payload: {
      files: file,
      status: localOpenCTActionType.CT_SELECTED,
      error: 0
    }
  };
};

export const localLoadCTStartAction = () => {
  return {
    type: localOpenCTActionType.LOAD_CT_START,
    payload: {
      files: null,
      status: localOpenCTActionType.LOAD_CT_START,
      error: 0
    }
  };
};

export const localLoadCTSucceedAction = function() {
  return {
    type: localOpenCTActionType.LOAD_CT_SUCCEED,
    payload: {
      files: null,
      status: localOpenCTActionType.LOAD_CT_SUCCEED,
      error: 1
    }
  };
};

export const localLoadCTFailedAction = function() {
  return {
    type: localOpenCTActionType.LOAD_CT_FAILED,
    payload: {
      files: null,
      status: localOpenCTActionType.LOAD_CT_FAILED,
      error: -1
    }
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
