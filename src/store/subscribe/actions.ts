import { doc, setDoc } from 'firebase/firestore';
import { Dispatch } from 'redux';
import { store } from '../';
import { db } from '../../firebase';
import { DialogData } from '../../models/dialog-form';
import { subscribeBlock } from '../../utils/data';
import { queueSnackbar } from '../snackbars';
import {
  SUBSCRIBE,
  SubscribeActions,
  SUBSCRIBE_FAILURE,
  SUBSCRIBE_RESET,
  SUBSCRIBE_SUCCESS,
} from './types';

const setSubscribe = async (data: DialogData): Promise<true> => {
  const id = data.email.replace(/[^\w\s]/gi, '');
  const subscriber: any = {
    email: data.email,
    firstName: data.firstFieldValue || '',
    lastName: data.secondFieldValue || '',
  };

  if (data.speaking) subscriber.speaking = data.speaking;
  if (data.attending) subscriber.attending = data.attending;
  if (data.sponsoring) subscriber.sponsoring = data.sponsoring;
  if (data.exhibiting) subscriber.exhibiting = data.exhibiting;
  if (data.volunteering) subscriber.volunteering = data.volunteering;

  await setDoc(doc(db, 'subscribers', id), subscriber);

  return true;
};

export const subscribe = (data: DialogData) => async (dispatch: Dispatch<SubscribeActions>) => {
  dispatch({
    type: SUBSCRIBE,
  });

  try {
    dispatch({
      type: SUBSCRIBE_SUCCESS,
      payload: await setSubscribe(data),
    });
    store.dispatch(queueSnackbar(subscribeBlock.toast));
  } catch (error) {
    dispatch({
      type: SUBSCRIBE_FAILURE,
      payload: error as Error,
    });
  }
};

export const resetSubscribed = () => {
  store.dispatch({
    type: SUBSCRIBE_RESET,
  });
};
