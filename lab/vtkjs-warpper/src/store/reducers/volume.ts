import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';
import * as Actions from '../actions/volume';
import { TypedAction } from '../actions/common/typedAction';

export interface IVolumeState {
  viewerID: string;
  isLoading: boolean;
  isDecompressing: boolean;
  isDicomLoading: boolean;
  progress: number;
  error: Error | null;
  imageData: vtkImageData | null;
}

export interface IVolumeStates {
  // TODO : Add Patient Information, Aquisition Information
  volumeStates: IVolumeState[];
}

export const initialState: IVolumeStates = {
  volumeStates: [],
};

export function volumeReducer(
  state: IVolumeStates = initialState,
  action: TypedAction
): IVolumeStates {
  switch (action.type) {
    case Actions.LOAD_REQUEST:
      return {
        ...state,
        volumeStates: state.volumeStates.concat({
          viewerID: action.payload.viewerID,
          isLoading: true,
          isDecompressing: false,
          isDicomLoading: false,
          progress: 0,
          error: null,
          imageData: null,
        }),
      };
    case Actions.LOAD_DECOMPRESS_REQUEST:
      return {
        ...state,
        volumeStates: state.volumeStates.map((volState: IVolumeState) =>
          volState.viewerID === action.payload.viewerID
            ? {
                ...volState,
                isDecompressing: true,
                progress: 0,
              }
            : volState
        ),
      };
    case Actions.LOAD_DICOM_REQUEST:
      return {
        ...state,
        volumeStates: state.volumeStates.map((volState: IVolumeState) =>
          volState.viewerID === action.payload.viewerID
            ? {
                ...volState,
                isDecompressing: false,
                isDicomLoading: true,
                progress: 0,
              }
            : volState
        ),
      };
    case Actions.LOAD_UPDATE_PROGRESS:
      return {
        ...state,
        volumeStates: state.volumeStates.map((volState: IVolumeState) =>
          volState.viewerID === action.payload.viewerID
            ? {
                ...volState,
                progress: action.payload.progress,
              }
            : volState
        ),
      };
    case Actions.LOAD_ABORT_REQUEST:
      return {
        ...state,
        volumeStates: state.volumeStates.filter(
          (volState: IVolumeState) => volState.viewerID !== action.payload.viewerID
        ),
      };
    case Actions.LOAD_SUCCESS:
      return {
        ...state,
        volumeStates: state.volumeStates.map((volState: IVolumeState) =>
          volState.viewerID === action.payload.viewerID
            ? {
                ...volState,
                isLoading: false,
                isDecompressing: false,
                isDicomLoading: false,
                imageData: action.payload.imageData,
              }
            : volState
        ),
      };
    case Actions.LOAD_FAIL:
      return {
        ...state,
        volumeStates: state.volumeStates.map((volState: IVolumeState) =>
          volState.viewerID === action.payload.viewerID
            ? {
                ...volState,
                isLoading: false,
                isDecompressing: false,
                isDicomLoading: false,
                imageData: null,
                error: action.payload.error,
              }
            : volState
        ),
      };
    default:
      return state;
  }
}
