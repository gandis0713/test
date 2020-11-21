import * as ObjectDBAction from '../../../store/actions/ObjectDB';
import { IOverlayInfo } from '../../../common/defines/overlayObject';
import { RootState } from '../../../store/rootReducer';
import { IObjectDBState } from '../../../store/reducers/ObjectDB';
import { IImplantSetInfo, ICanalInfo } from '../../../common/defines/simulationObject';

export interface IDispatchToProps {
  selectObjectAction: (objectID: string) => void;
  addOverlayAction: (overlay: IOverlayInfo) => void;
  selectImplantSetAction: (implantID: string) => void;
  addImplantSetAction: (implant: IImplantSetInfo) => void;
}

export function mapStateToProps(state: RootState): IObjectDBState {
  const { objectDBState } = state;
  return objectDBState;
}

export const mapDispatchToProps = (dispatch): IDispatchToProps => ({
  selectObjectAction: (objectID: string): void =>
    dispatch(ObjectDBAction.selectObjectAction(objectID)),
  addOverlayAction: (overlay: IOverlayInfo): void =>
    dispatch(ObjectDBAction.addOverlayAction(overlay)),
  selectImplantSetAction: (implantID: string): void =>
    dispatch(ObjectDBAction.selectImplantSetAction(implantID)),
  addImplantSetAction: (implant: IImplantSetInfo): void =>
    dispatch(ObjectDBAction.addImplantSetAction(implant)),
});
