import { handleActions } from 'redux-actions';
import { actionTypes } from '../actions/volumeData';

export interface OpenCTState {
  files: FileList | null;
  status: string;
  error: string;
  progress: number;
}

const initialState: OpenCTState = {
  files: null,
  status: 'init',
  error: '',
  progress: 0
};

const openCTReducer = handleActions(
  {
    [actionTypes.SELECT_CT]: (state: OpenCTState, action) => {
      if (action.payload.files && action.payload.files.length > 2) {
        console.log(`selected file${action.payload.files.length}`);
        return {
          ...state,
          files: action.payload.files,
          status: actionTypes.SELECT_CT,
          error: '',
          progress: 0
        };
      }
      console.log(`selected file- none`);
      return state;
    },
    [actionTypes.OPEN_CT_START]: (state: OpenCTState) => {
      console.log(`open CT started`);
      return {
        ...state,
        status: actionTypes.OPEN_CT_START
      };
    },
    [actionTypes.LOADING_CT]: (state: OpenCTState, action) => {
      console.log(`open CT in progress...`);
      return {
        ...state,
        status: actionTypes.LOADING_CT,
        progress: action.payload.progress
      };
    },
    [actionTypes.OPEN_CT_SUCCESS]: (state: OpenCTState) => {
      console.log(`open CT success`);
      return {
        ...state,
        status: actionTypes.OPEN_CT_SUCCESS
      };
    },
    [actionTypes.OPEN_CT_FAILURE]: (state: OpenCTState, action) => {
      console.log(`open CT failure`);
      return {
        ...state,
        status: actionTypes.OPEN_CT_FAILURE,
        error: action.payload.error
      };
    }
  },
  initialState
);

export default openCTReducer;
