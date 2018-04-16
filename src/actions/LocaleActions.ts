import { ActionTypes } from '../constants/ActionTypes';
import { getSystemLocale } from '../selectors/localeSelectors';

export interface SetLocaleAction {
	type: ActionTypes.SET_LOCALE;
	payload: {
		locale: string;
		localeType: 'default' | 'set';
	};
}

export function _setLocale(locale?: string): SetLocaleAction {
	const localeType = !locale ? 'default' : 'set';
	return {
		type: ActionTypes.SET_LOCALE,
		payload: {
			locale: locale || getSystemLocale(),
			localeType
		}
	};
}
