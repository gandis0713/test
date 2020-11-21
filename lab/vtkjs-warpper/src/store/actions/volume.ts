import vtkImageData from 'vtk.js/Sources/Common/DataModel/ImageData';
import { typedAction, TypedAction } from './common/typedAction';

// Action Types
export const VOLUME = 'VOLUME';
export const LOAD_REQUEST = `${VOLUME}/LOAD_REQUEST`;
export const LOAD_DECOMPRESS_REQUEST = `${VOLUME}/LOAD_DECOMPRESS_REQUEST`;
export const LOAD_DICOM_REQUEST = `${VOLUME}/LOAD_DICOM_REQUEST`;
export const LOAD_UPDATE_PROGRESS = `${VOLUME}/LOAD_UPDATE_PROGRESS`;
export const LOAD_ABORT_REQUEST = `${VOLUME}/LOAD_ABORT_REQUEST`;
export const LOAD_SUCCESS = `${VOLUME}/LOAD_SUCCESS`;
export const LOAD_FAIL = `${VOLUME}/LOAD_FAILURE`;

// Actions
export const loadRequestAction = (
  viewerID: string,
  data: FileList | string[] | ArrayBuffer[] | Blob[] | string
): TypedAction => {
  return typedAction(LOAD_REQUEST, { viewerID, data });
};

export const loadDecompressRequestAction = (viewerID: string, filename: string): TypedAction => {
  return typedAction(LOAD_DECOMPRESS_REQUEST, { viewerID, filename });
};

export const loadDicomRequestAction = (
  viewerID: string,
  data: FileList | string[] | ArrayBuffer[] | Blob[]
): TypedAction => {
  return typedAction(LOAD_DICOM_REQUEST, { viewerID, data });
};

export const loadUpdateProgressAction = (viewerID: string, progress: number): TypedAction => {
  return typedAction(LOAD_UPDATE_PROGRESS, { viewerID, progress });
};

export const loadAbortAction = (viewerID: string): TypedAction => {
  return typedAction(LOAD_ABORT_REQUEST, viewerID);
};

export const loadSuccessAction = (viewerID: string, imageData: vtkImageData): TypedAction => {
  return typedAction(LOAD_SUCCESS, { viewerID, imageData });
};

export const loadFailAction = (viewerID: string, error: Error): TypedAction => {
  return typedAction(LOAD_FAIL, { viewerID, error });
};
