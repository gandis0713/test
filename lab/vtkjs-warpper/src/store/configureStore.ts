import { createStore, applyMiddleware } from 'redux';
import { composeWithDevTools } from 'redux-devtools-extension';
import { createLogger } from 'redux-logger';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

import * as VolumeAction from './actions/volume';

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
function configureStore() {
  const logger = createLogger({
    predicate: (getState, action) => action.type !== VolumeAction.LOAD_UPDATE_PROGRESS,
  });

  const sagaMiddleware = createSagaMiddleware();
  let middlewares;
  let store;

  if (process.env.NODE_ENV === 'development') {
    middlewares = [sagaMiddleware];
    store = createStore(rootReducer, composeWithDevTools(applyMiddleware(...middlewares)));
  } else {
    middlewares = [sagaMiddleware];
    store = createStore(rootReducer, applyMiddleware(...middlewares));
  }

  sagaMiddleware.run(rootSaga);

  return store;
}
const store = configureStore();

export default store;
export type AppDispatch = typeof store.dispatch;
