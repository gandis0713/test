import store from '../../store/configureStore';
import { RootState } from '../../store/rootReducer';
import * as ObjectIDAction from '../../store/actions/ObjectID';
import { ObjectType } from '../defines/object';

// Use when add new object
export const getNewID = (type: ObjectType): string => {
  const { objectIDState } = store.getState() as RootState;
  const idState = objectIDState.idStateList.find((state) => state.type === type);
  let idValue = 0;
  if (idState) {
    idValue = idState.count;
  }
  store.dispatch(ObjectIDAction.incrementObjectIDAction(type));
  return `${type}_${idValue.toString()}`;
};

// Use when add objects from project file
export const addID = (objectID: string): void => {
  const list = objectID.split('_');

  if (list.length !== 2) return;

  let obejctType: ObjectType = ObjectType[list[0]];
  if (!obejctType) {
    obejctType = ObjectType.Unknown;
  }
  const idNumber: number = parseInt(list[1], 10);
  store.dispatch(ObjectIDAction.registerObjectIDAction(idNumber, obejctType));
};

export default getNewID;
