import { typedAction, TypedAction } from './common/typedAction';
import { IOverlayInfo } from '../../common/defines/overlayObject';
import { IImplantSetInfo } from '../../common/defines/simulationObject';

// Action Types
export const OBJECTDB = 'OBJECTDB';
export const SELECT_OBJECT = `${OBJECTDB}/SELECT_OBJECT`;
export const CLEAR_SELECTION = `${OBJECTDB}/CLEAR_SELECTION`;
export const ADD_OVERLAY = `${OBJECTDB}/ADD_OVERLAY_OBJECT`;
export const DELETE_OVERLAY = `${OBJECTDB}/DELETE_OVERLAY_OBJECT`;
export const SET_VISIBLE_OVERLAY = `${OBJECTDB}/SET_VISIBLE_OVERLAY_OBJECT`;
export const ADD_IMPLANTSET = `${OBJECTDB}/ADD_IMPLANTSET_OBJECT`;
export const DELETE_IMPLANTSET = `${OBJECTDB}/DELETE_IMPLANTSET_OBJECT`;
export const SET_VISIBLE_IMPLANT = `${OBJECTDB}/SET_VISIBLE_IMPLANT_OBJECT`;
export const SET_VISIBLE_CROWN = `${OBJECTDB}/SET_VISIBLE_CROWN_OBJECT`;

export const selectObjectAction = (objectId: string): TypedAction => {
  return typedAction(SELECT_OBJECT, objectId);
};

export const clearSelectionAction = (): TypedAction => {
  return typedAction(CLEAR_SELECTION);
};

export const addOverlayAction = (overlay: IOverlayInfo): TypedAction => {
  return typedAction(ADD_OVERLAY, overlay);
};

export const deleteOverlayAction = (objectId: string): TypedAction => {
  return typedAction(DELETE_OVERLAY, objectId);
};

export const setVisibleOverlayAction = (overlayId: string, visible: boolean): TypedAction => {
  return typedAction(SET_VISIBLE_OVERLAY, { overlayId, visible });
};

export const selectImplantSetAction = (objectId: string): TypedAction => {
  return typedAction(SELECT_OBJECT, objectId);
};

export const addImplantSetAction = (implant: IImplantSetInfo): TypedAction => {
  return typedAction(ADD_IMPLANTSET, implant);
};

export const deleteImplantAction = (implantId: string): TypedAction => {
  return typedAction(DELETE_IMPLANTSET, implantId);
};

export const setVisibleImplantAction = (implantId: number, visible: boolean): TypedAction => {
  return typedAction(SET_VISIBLE_IMPLANT, { implantId, visible });
};

export const setVisibleCrownAction = (crownId: string, visible: boolean): TypedAction => {
  return typedAction(SET_VISIBLE_CROWN, { crownId, visible });
};
