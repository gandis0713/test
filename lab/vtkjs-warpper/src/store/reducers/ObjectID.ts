import * as Actions from '../actions/ObjectID';
import { TypedAction } from '../actions/common/typedAction';
import { ObjectType } from '../../common/defines/object';

interface IIDState {
  type: ObjectType;
  count: number;
}

export interface IObjectIDState {
  idStateList: IIDState[];
}

const getInitState = (): IIDState[] => {
  const list: IIDState[] = [];
  Object.keys(ObjectType).map((key) => list.push({ type: key as ObjectType, count: 0 }));
  return list;
};

export const initialState: IObjectIDState = {
  idStateList: getInitState(),
};

export function objectIDReducer(
  state: IObjectIDState = initialState,
  action: TypedAction
): IObjectIDState {
  switch (action.type) {
    case Actions.INCREMENT_ID_COUNT:
      return {
        ...state,
        idStateList: state.idStateList.map((idState) => {
          if (idState.type === action.payload) {
            return {
              ...idState,
              count: idState.count + 1,
            };
          }
          return idState;
        }),
      };
    case Actions.REGISTER_ID:
      return {
        ...state,
        idStateList: state.idStateList.map((idState) => {
          if (idState.type === action.payload.type) {
            if (idState.count < action.payload.id) {
              return {
                ...idState,
                count: action.payload.id,
              };
            }
            return idState;
          }
          return idState;
        }),
      };
    case Actions.RESET_ALL:
      return {
        ...state,
        idStateList: getInitState(),
      };
    default:
      return state;
  }
}
