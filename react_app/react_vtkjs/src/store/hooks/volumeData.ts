import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  localCTSelectedAction,
  localLoadCTStartAction,
  localLoadCTSucceedAction,
  localLoadCTFailedAction
} from '../actions/volumeData';
import { LocalLoadCTState, LocalLoadCTReducer } from '../reducers/volumeData';
import { RootState } from '../index';

export function useLocalLoadCTState(): LocalLoadCTState {
  const localLoadCTState: LocalLoadCTState = useSelector(
    (state: RootState) => state.localOpenCTReducer
  );
  return localLoadCTState;
}

export function useLocalSelectCTAction(): Function {
  const dispatch = useDispatch();
  const onSelect = useCallback(
    (files: FileList) => dispatch(localCTSelectedAction(files)),
    [dispatch]
  );

  return onSelect;
}
export function useLocalOpenCTStartAction(): Function {
  const dispatch = useDispatch();
  const onLoad = useCallback(() => {
    dispatch(localLoadCTStartAction());
  }, [dispatch]);
  return onLoad;
}

export function useLocalOpenCTSucceedAction(): Function {
  const dispatch = useDispatch();
  const onLoad = useCallback(() => {
    dispatch(localLoadCTSucceedAction());
  }, [dispatch]);
  return onLoad;
}

export function useLocalOpenCTFailedAction(): Function {
  const dispatch = useDispatch();
  const onLoad = useCallback(() => {
    dispatch(localLoadCTFailedAction());
  }, [dispatch]);
  return onLoad;
}
