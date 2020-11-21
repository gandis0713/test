import { useDispatch, useSelector } from 'react-redux';
import { useCallback } from 'react';
import {
  selectCTAction,
  openCTStartAction,
  loadingCTAction,
  openCTSuccessAction,
  openCTFailedAction
} from '../actions/volumeData';
import { OpenCTState } from '../reducers/volumeData';
import { RootState } from '../index';

export function useOpenCTState(): OpenCTState {
  const uploadState = useSelector((state: RootState) => state.openCTReducer);
  return uploadState;
}

export function useSelectCTAction(): Function {
  const dispatch = useDispatch();
  const onSelectCT = useCallback((files: FileList) => dispatch(selectCTAction(files)), [dispatch]);

  return onSelectCT;
}

export function useOpenCTStartAction(): Function {
  const dispatch = useDispatch();
  const onOpenCTStart = useCallback(() => {
    dispatch(openCTStartAction());
  }, [dispatch]);
  return onOpenCTStart;
}

export function useLoadingCTAction(): Function {
  const dispatch = useDispatch();
  const onLoadingCT = useCallback((progress: number) => dispatch(loadingCTAction(progress)), [
    dispatch
  ]);

  return onLoadingCT;
}

export function useOpenCTSuccessAction(): Function {
  const dispatch = useDispatch();
  const onOpenCTSuccess = useCallback(() => {
    dispatch(openCTSuccessAction());
  }, [dispatch]);
  return onOpenCTSuccess;
}

export function useOpenCTFailedAction(): Function {
  const dispatch = useDispatch();
  const onOpenCTFailed = useCallback(
    (error: string) => {
      dispatch(openCTFailedAction(error));
    },
    [dispatch]
  );
  return onOpenCTFailed;
}
