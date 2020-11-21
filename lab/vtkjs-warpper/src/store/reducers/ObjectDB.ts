import * as Actions from '../actions/ObjectDB';
import { TypedAction } from '../actions/common/typedAction';
import { IOverlayInfo } from '../../common/defines/overlayObject';
import { IImplantSetInfo, ICanalInfo } from '../../common/defines/simulationObject';

export interface IObjectDBState {
  selectedObjectID: string;
  overlayList: IOverlayInfo[];
  implantSetList: IImplantSetInfo[];
  canalList: ICanalInfo[];
}

export const initialState: IObjectDBState = {
  selectedObjectID: '',
  overlayList: [],
  implantSetList: [],
  canalList: [],
};

export function objectDBReducer(
  state: IObjectDBState = initialState,
  action: TypedAction
): IObjectDBState {
  switch (action.type) {
    case Actions.SELECT_OBJECT: {
      return {
        ...state,
        selectedObjectID: action.payload,
      };
    }
    case Actions.CLEAR_SELECTION: {
      return {
        ...state,
        selectedObjectID: '',
      };
    }
    case Actions.ADD_OVERLAY: {
      return {
        ...state,
        overlayList: state.overlayList.concat(action.payload),
      };
    }
    case Actions.DELETE_OVERLAY: {
      return {
        ...state,
        overlayList: state.overlayList.filter(
          (overlay: IOverlayInfo) => overlay.id !== action.payload
        ),
      };
    }
    case Actions.SET_VISIBLE_OVERLAY: {
      return {
        ...state,
        overlayList: state.overlayList.map((overlay: IOverlayInfo) => {
          if (overlay.id === action.payload.id) {
            return { ...overlay, visible: action.payload.visible };
          }
          return overlay;
        }),
      };
    }
    case Actions.ADD_IMPLANTSET: {
      return {
        ...state,
        implantSetList: state.implantSetList.concat(action.payload),
      };
    }
    case Actions.DELETE_IMPLANTSET: {
      return {
        ...state,
        implantSetList: state.implantSetList.filter(
          (implant: IImplantSetInfo) => implant.id !== action.payload
        ),
      };
    }
    default:
      return state;
  }
}
