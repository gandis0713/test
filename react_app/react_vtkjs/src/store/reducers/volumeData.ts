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
      console.log(localOpenCTActionType.CT_SELECTED);
      return {
        ...state,
        files: action.payload.files,
        status: action.payload.status,
        error: action.payload.error
      };
    case localOpenCTActionType.LOAD_CT_START:
      console.log(localOpenCTActionType.LOAD_CT_START);
      return {
        ...state,
        files: action.payload.files,
        status: action.payload.status,
        error: action.payload.error
      };
    case localOpenCTActionType.LOAD_CT_SUCCEED:
      console.log(localOpenCTActionType.LOAD_CT_SUCCEED);
      return {
        ...state,
        files: action.payload.files,
        status: action.payload.status,
        error: action.payload.error
      };
    case localOpenCTActionType.LOAD_CT_FAILED:
      console.log(localOpenCTActionType.LOAD_CT_FAILED);
      return {
        ...state,
        files: action.payload.files,
        status: action.payload.status,
        error: action.payload.error
      };
    default:
      console.log('initialize');
      return state;
  }
};

export type LocalLoadCTReducer = ReturnType<typeof localLoadCTReducer>;
export default localLoadCTReducer;
