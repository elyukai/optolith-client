import { AppState } from '../reducers/app';
import { getSystemLocale as getSystemLocaleAPI } from '../utils/FileAPIUtils';

export const getMessages = (state: AppState) => state.locale.messages;
export const getLocaleId = (state: AppState) => state.locale.id;
export const getLocaleType = (state: AppState) => state.locale.type;

export function getSystemLocale() {
	return getSystemLocaleAPI();
}

