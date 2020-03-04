// import { handleActions } from "redux-actions";
import { ActionType, createReducer } from 'typesafe-actions';
import { actionTypes, OpenCTActions } from '../actions/volumeData';

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

const openCTReducer = createReducer(initialState).handleType(
  actionTypes.OPEN_CT,
  (state, action) => ({
    files: action.payload,
    status: 'init',
    error: '',
    progress: 0
  })
);
// const openCTReducer = createReducer<OpenCTState, OpenCTActions>(initialState, {
//   [actionTypes.OPEN_CT]: (state, { payload }) => {
//     var newState: OpenCTState = {
//       files: payload.files,
//       status: 'init',
//       error: '',
//       progress: 0
//     };
//     return newState;
//   }
// });

// [ADD_TODO]: (state, { payload: text }) =>
// state.concat({
//   id: Math.max(...state.map(todo => todo.id)) + 1,
//   text,
//   done: false
// }),
// [TOGGLE_TODO]: (state, { payload: id }) =>
// state.map(todo => (todo.id === id ? { ...todo, done: !todo.done } : todo)),
// [REMOVE_TODO]: (state, { payload: id }) =>
// state.filter(todo => todo.id !== id)
// const openCTReducer = handleActions(
//   {
//     [actionTypes.SELECT_CT]: (state: OpenCTState, action) => {
//       if (action.payload.files && action.payload.files.length > 2) {
//         console.log(`selected file${action.payload.files.length}`);
//         return {
//           ...state,
//           files: action.payload.files,
//           status: 'CT selected',
//           error: '',
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
//         status: 'open CT'
//       };
//     },
//     [actionTypes.OPEN_CT_START]: (state: OpenCTState) => {
//       console.log(`open CT started`);
//       return {
//         ...state,
//         status: 'Open CT started'
//       };
//     },
//     [actionTypes.OPEN_CT_PROGRESS]: (state: OpenCTState, action) => {
//       console.log(`open CT in progress...`);
//       return {
//         ...state,
//         status: 'Open CT in progress...',
//         progress: action.payload.progress
//       };
//     },
//     [actionTypes.OPEN_CT_SUCCESS]: (state: OpenCTState) => {
//       console.log(`open CT success`);
//       return {
//         ...state,
//         status: 'Open CT success'
//       };
//     },
//     [actionTypes.OPEN_CT_FAILURE]: (state: OpenCTState, action) => {
//       console.log(`open CT failure`);
//       return {
//         ...state,
//         status: 'Open CT failure',
//         error: action.payload.error
//       };
//     }
//   },
//   initialState
// );

export default openCTReducer;
