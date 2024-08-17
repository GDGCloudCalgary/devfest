import { ContentState } from "./state";

export const FETCH_CONTENT_STATE = 'FETCH_CONTENT_STATE';
export const FETCH_CONTENT_STATE_FAILURE = 'FETCH_CONTENT_STATE_FAILURE';
export const FETCH_CONTENT_STATE_SUCCESS = 'FETCH_CONTENT_STATE_SUCCESS';

interface FetchContentStateAction {
  type: typeof FETCH_CONTENT_STATE;
}

interface FetchContentStateFailureAction {
  type: typeof FETCH_CONTENT_STATE_FAILURE;
  payload: Error;
}

interface FetchContentStateSuccessAction {
  type: typeof FETCH_CONTENT_STATE_SUCCESS;
  payload: ContentState;
}

export type FetchContentStateActions =
  | FetchContentStateAction
  | FetchContentStateFailureAction
  | FetchContentStateSuccessAction;
