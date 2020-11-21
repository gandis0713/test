import { typedAction, TypedAction } from './common/typedAction';
import { ObjectType } from '../../common/defines/object';

// Action Types
export const OBJECTID = 'OBJECTID';
export const INCREMENT_ID_COUNT = `${OBJECTID}/INCREMENT_ID_COUNT`;
export const REGISTER_ID = `${OBJECTID}/REGISTER`;
export const RESET_ALL = `${OBJECTID}/RESET_ALL`;

// Actions
export const incrementObjectIDAction = (type: ObjectType): TypedAction => {
  return typedAction(INCREMENT_ID_COUNT, type);
};

export const registerObjectIDAction = (id: number, type: ObjectType): TypedAction => {
  return typedAction(REGISTER_ID, { id, type });
};

export const resetAllAction = (): TypedAction => {
  return typedAction(RESET_ALL);
};
