import { remote } from 'electron';

export function getSystemLocale() {
	return remote.app.getLocale().match(/^de/) ? 'de-DE' : 'en-US';
}
