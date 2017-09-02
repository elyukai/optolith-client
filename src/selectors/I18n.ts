import { remote } from 'electron';
import { AppState } from '../reducers/app';
import { store } from '../stores/AppStore';
import { UIMessages } from '../types/data.d';

export const getLocaleId = (state: AppState) => state.locale.id;

export function getMessages(state = store.getState()) {
	return state.locale.messages || {} as UIMessages;
}

export function getLocale(state = store.getState()) {
	return getLocaleSetting(state) || getSystemLocale();
}

export function getLocaleSetting(state = store.getState()) {
	return state.locale.id;
}

export function getSystemLocale() {
	return remote.app.getLocale().match(/^de/) ? 'de-DE' : 'en-US';
}
