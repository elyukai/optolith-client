import { remote } from 'electron';
import { store } from '../stores/AppStore';
import { UIMessages } from '../types/ui.d';

export function getMessages() {
	return store.getState().locale.messages || {} as UIMessages;
}

export function getLocale() {
	return getLocaleSetting() || getSystemLocale();
}

export function getLocaleSetting() {
	return store.getState().locale.id;
}

export function getSystemLocale() {
	return remote.app.getLocale().match(/^de/) ? 'de-DE' : 'en-US';
}
