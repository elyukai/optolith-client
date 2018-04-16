import { remote } from 'electron';

export function getSystemLocale() {
	const systemLocale = remote.app.getLocale();
	if (systemLocale.match(/^de/)) {
		return 'de-DE';
	}
	else if (systemLocale.match(/^nl/)) {
		return 'nl-BE';
	}
	return 'en-US';
}
