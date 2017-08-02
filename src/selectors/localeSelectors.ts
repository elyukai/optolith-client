import { AppState } from '../reducers/app';

export const getMessages = (state: AppState) => state.locale.messages;
export const getLocaleId = (state: AppState) => state.locale.id;
