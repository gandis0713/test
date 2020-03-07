import { localOpenCTActionType } from '../actions/volumeData';

export interface LocalLoadCTState {
  files: FileList | null;
  status: string;
  error: string;
}

export const initialState: LocalLoadCTState = {
  files: null,
  status: '',
  error: ''
};

const localLoadCTReducer = function(
  state: LocalLoadCTState = initialState,
  action: any
) {
  switch (action.type) {
    case localOpenCTActionType.CT_SELECTED:
      return {
        ...state,
        files: action.payload,
        status: localOpenCTActionType.CT_SELECTED,
        error: ''
      };
    case localOpenCTActionType.LOAD_CT_START:
      return {
        ...state,
        files: action.payload,
        status: localOpenCTActionType.LOAD_CT_START,
        error: ''
      };
    case localOpenCTActionType.LOAD_CT_SUCCEED:
      return {
        ...state,
        files: action.payload,
        status: localOpenCTActionType.LOAD_CT_SUCCEED,
        error: ''
      };
    case localOpenCTActionType.LOAD_CT_FAILED:
      return {
        ...state,
        files: action.payload,
        status: localOpenCTActionType.LOAD_CT_FAILED,
        error: ''
      };
    default:
      return state;
  }
};

export type LocalLoadCTReducer = ReturnType<typeof localLoadCTReducer>;
export default localLoadCTReducer;
