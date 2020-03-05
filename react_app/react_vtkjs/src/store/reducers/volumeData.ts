import { localOpenCTActionType } from '../actions/volumeData';

export interface LoaclOpenCTState {
  files: FileList | null;
  status: string;
  error: string;
}

export const initialState = {
  files: null,
  status: '',
  error: ''
};

const localOpenCTReducer = function(state: LoaclOpenCTState, action: any) {
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
      break;
  }
};

export default localOpenCTActionType;

// import { handleActions } from "redux-actions";
// import { actionTypes } from "../actions/volumeData";

// export interface OpenCTState {
//   files: FileList | null;
//   status: string;
//   error: string;
//   progress: number;
// }

// const initialState: OpenCTState = {
//   files: null,
//   status: "init",
//   error: "",
//   progress: 0
// };

// const openCTReducer = handleActions(
//   {
//     [actionTypes.SELECT_CT]: (state: OpenCTState, action) => {
//       if (action.payload.files && action.payload.files.length > 2) {
//         console.log(`selected file${action.payload.files.length}`);
//         return {
//           ...state,
//           files: action.payload.files,
//           status: "CT selected",
//           error: "",
//           progress: 0
//         };
//       }
//       console.log(`selected file- none`);
//       return state;
//     },
//     [actionTypes.OPEN_CT]: (state: OpenCTState) => {
//       console.log(`open CT`);
//       return {
//         ...state,
//         status: "open CT"
//       };
//     },
//     [actionTypes.OPEN_CT_START]: (state: OpenCTState) => {
//       console.log(`open CT started`);
//       return {
//         ...state,
//         status: "Open CT started"
//       };
//     },
//     [actionTypes.OPEN_CT_PROGRESS]: (state: OpenCTState, action) => {
//       console.log(`open CT in progress...`);
//       return {
//         ...state,
//         status: "Open CT in progress...",
//         progress: action.payload.progress
//       };
//     },
//     [actionTypes.OPEN_CT_SUCCESS]: (state: OpenCTState) => {
//       console.log(`open CT success`);
//       return {
//         ...state,
//         status: "Open CT success"
//       };
//     },
//     [actionTypes.OPEN_CT_FAILURE]: (state: OpenCTState, action) => {
//       console.log(`open CT failure`);
//       return {
//         ...state,
//         status: "Open CT failure",
//         error: action.payload.error
//       };
//     }
//   },
//   initialState
// );

// export default openCTReducer;
