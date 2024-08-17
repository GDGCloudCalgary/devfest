import { Initialized, RemoteData } from '@abraham/remotedata';

export interface ContentState {
  date?: string;
  [key: string]: any;
}

export type ContentStateData = Omit<ContentState, 'id'>;

export type ContentStateState = RemoteData<Error, ContentState>;
export const initialContentStateState: ContentStateState = new Initialized();
