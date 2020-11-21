import { combineReducers } from 'redux';
import { volumeReducer, IVolumeStates } from './reducers/volume';
import { imageAdjustReducer, IImageAdjustState } from './reducers/imageAdjust';
import { objectDBReducer, IObjectDBState } from './reducers/ObjectDB';
import { objectIDReducer, IObjectIDState } from './reducers/ObjectID';

export type RootState = {
  volumeDataStates: IVolumeStates;
  imageAdjustState: IImageAdjustState;
  objectDBState: IObjectDBState;
  objectIDState: IObjectIDState;
};

const rootReducer = combineReducers({
  volumeDataStates: volumeReducer,
  imageAdjustState: imageAdjustReducer,
  objectDBState: objectDBReducer,
  objectIDState: objectIDReducer,
});

export default rootReducer;
