import { useDispatch, useSelector } from "react-redux";
import { useCallback } from "react";
import { selectCTAction, openCTAction } from "../actions/volumeData";
import { OpenCTState } from "../reducers/volumeData";
import { RootState } from "../index";

export function useOpenCTState(): OpenCTState {
  const uploadState: OpenCTState = useSelector((state: RootState) => state.openCTReducer);
  return uploadState;
}

export function useSelectCTAction(): Function {
  const dispatch = useDispatch();
  const onSelect = useCallback(
    (files: FileList) => dispatch(selectCTAction(files)),
    [dispatch]
  );

  return onSelect;
}
export function useOpenCTAction(): Function {
  const dispatch = useDispatch();
  const onLoad = useCallback(() => {
    dispatch(openCTAction());
  }, [dispatch]);
  return onLoad;
}
