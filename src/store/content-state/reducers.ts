import { Failure, Pending, Success } from '@abraham/remotedata';
import { ContentStateState, initialContentStateState } from './state';
import {
    FetchContentStateActions,
    FETCH_CONTENT_STATE,
    FETCH_CONTENT_STATE_FAILURE,
    FETCH_CONTENT_STATE_SUCCESS
} from './types';

export const contentStateReducer = (
    state = initialContentStateState,
    action: FetchContentStateActions
): ContentStateState => {
    switch (action.type) {
        case FETCH_CONTENT_STATE:
            return new Pending();

        case FETCH_CONTENT_STATE_FAILURE:
            return new Failure(action.payload);

        case FETCH_CONTENT_STATE_SUCCESS:
            return new Success(action.payload);

        default:
            return state;
    }
};
