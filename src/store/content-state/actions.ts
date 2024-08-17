import { Initialized, Success } from '@abraham/remotedata';
import { Dispatch } from 'redux';
import { subscribeToDocument, Subscription } from '../../utils/firestore';
import { ContentState } from './state';
import {
  FETCH_CONTENT_STATE,
  FETCH_CONTENT_STATE_FAILURE,
  FETCH_CONTENT_STATE_SUCCESS,
  FetchContentStateActions,
} from './types';

let subscription: Subscription = new Initialized();

export const unsubscribe = () => {
  if (subscription instanceof Success) {
    subscription.data();
  }
};

export const fetchContentState = async (dispatch: Dispatch<FetchContentStateActions>) => {
    if (subscription instanceof Initialized) {
      subscription = subscribeToDocument<ContentState>(
        `config/site/States/current`,
        () => dispatch({ type: FETCH_CONTENT_STATE }),
        (payload) => {
          return dispatch({
            type: FETCH_CONTENT_STATE_SUCCESS,
            payload: payload || {},
          })
        },
        (payload: Error) => dispatch({ type: FETCH_CONTENT_STATE_FAILURE, payload })
      );
    }
  };
