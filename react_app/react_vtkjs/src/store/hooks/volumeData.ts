import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  localSelectCTAction,
  localLoadCTStartAction,
  localLoadCTSucceedAction,
  localLoadCTFailedAction
} from '../actions/volumeData';
import { LocalLoadCTState, LocalLoadCTReducer } from '../reducers/volumeData';

export function useLocalLoadCTState(): LocalLoadCTState {
  const localLoadCTState: LocalLoadCTState = useSelector(
    (state: LocalLoadCTReducer) => state
  );
  return localLoadCTState;
}

export function useLocalSelectCTAction(): Function {
  const dispatch = useDispatch();
  const onSelect = useCallback(
    (files: FileList) => dispatch(localSelectCTAction(files)),
    [dispatch]
  );

  return onSelect;
}
export function useLocalOpenCTStartAction(): Function {
  const dispatch = useDispatch();
  const onLoad = useCallback(
    (files: FileList) => {
      dispatch(localLoadCTStartAction(files));
    },
    [dispatch]
  );
  return onLoad;
}
