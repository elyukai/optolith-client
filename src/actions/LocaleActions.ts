import * as ActionTypes from '../constants/ActionTypes';
import { getSystemLocale } from '../selectors/I18n';

export interface SetLocaleAction {
	type: ActionTypes.SET_LOCALE;
	payload: {
		locale: string;
		localeType: 'default' | 'set';
	};
}

export const setLocale = (locale?: string) => AppDispatcher.dispatch<SetLocaleAction>({
	type: ActionTypes.SET_LOCALE,
	payload: {
		locale
	}
});

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
