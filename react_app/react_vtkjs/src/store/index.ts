import {
  createStore,
  combineReducers,
  compose,
  Store,
  applyMiddleware
} from 'redux';
import localOpenCTReducer from './reducers/volumeData';

const rootReducer = combineReducers({
  localOpenCTReducer
});

const store = createStore(rootReducer);
export { store as default };
