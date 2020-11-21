import { take, fork, takeEvery, put, call, delay } from 'redux-saga/effects';
import { eventChannel, END } from 'redux-saga';

import * as Actions from '../actions/volume';
import { TypedAction } from '../actions/common/typedAction';
import { LoadDicomFiles, IResultLoadingDicom } from '../../io/Dicoms';
import unzipByFilename from '../../io/zipFile';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createVolumeLoadingRunner(data) {
  let emit;
  const chan = eventChannel((emitter) => {
    emit = emitter;
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-empty-function
    return () => {};
  });

  const cbProgress = (progress: number): void => {
    emit(progress);

    if (progress >= 1) {
      emit(END);
    }
  };
  const promise = LoadDicomFiles(data, cbProgress);

  return [promise, chan];
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function createUnzipRunner(filename: string) {
  let emit;
  const chan = eventChannel((emitter) => {
    emit = emitter;
    // eslint-disable-next-line @typescript-eslint/explicit-function-return-type, @typescript-eslint/no-empty-function
    return () => {};
  });

  const cbProgress = (progress: number): void => {
    emit(progress);

    if (progress >= 1) {
      emit(END);
    }
  };
  const promise = unzipByFilename(filename, cbProgress);

  return [promise, chan];
}

function* watchOnProgress(viewerID, chan): Generator {
  while (true) {
    const progress = yield take(chan);
    yield put(Actions.loadUpdateProgressAction(viewerID, progress as number));
  }
}

function* watchOnDecompressProgress(viewerID, chan): Generator {
  while (true) {
    const progress = yield take(chan);
    yield put(Actions.loadUpdateProgressAction(viewerID, progress as number));
  }
}

function* loadDicomAsync(action: TypedAction): Generator {
  const [promise, chan] = createVolumeLoadingRunner(action.payload.data);
  yield fork(watchOnProgress, action.payload.viewerID, chan);
  try {
    const result = yield call(() => promise);
    const loadingResult = result as IResultLoadingDicom;
    if (loadingResult) {
      delay(500);
      yield put(Actions.loadSuccessAction(action.payload.viewerID, loadingResult.data));
      // TODO: Handle unloaded files
    } else {
      yield put(
        Actions.loadFailAction(
          action.payload.viewerID,
          new Error('Unknown error accured during loading CT.')
        )
      );
    }
  } catch (err) {
    yield put(Actions.loadFailAction(action.payload.viewerID, err));
  }
}

function* decompressAsync(action: TypedAction): Generator {
  const [promise, chan] = createUnzipRunner(action.payload.filename);
  yield fork(watchOnDecompressProgress, action.payload.viewerID, chan);
  try {
    const result = yield call(() => promise);
    yield put(Actions.loadDicomRequestAction(action.payload.viewerID, result as Blob[]));
  } catch (err) {
    yield put(Actions.loadFailAction(action.payload.viewerID, err));
  }
}

function* loadVolumeAsync(action: TypedAction): Generator {
  if (typeof action.payload.data === 'string' && (action.payload.data as string).includes('.CT')) {
    yield put(Actions.loadDecompressRequestAction(action.payload.viewerID, action.payload.data));
  } else {
    yield put(Actions.loadDicomRequestAction(action.payload.viewerID, action.payload.data));
  }
}

export default function* watchVolume(): Generator {
  yield takeEvery(Actions.LOAD_REQUEST, loadVolumeAsync);
  yield takeEvery(Actions.LOAD_DECOMPRESS_REQUEST, decompressAsync);
  yield takeEvery(Actions.LOAD_DICOM_REQUEST, loadDicomAsync);
}
