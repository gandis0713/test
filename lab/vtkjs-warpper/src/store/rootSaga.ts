import { all, fork } from 'redux-saga/effects';

import watchVolume from './sagas/volume';

export default function* rootSaga(): Generator {
  yield all([fork(watchVolume)]);
}
