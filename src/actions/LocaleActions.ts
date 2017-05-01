import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';

export interface SetLocaleAction extends Action {
	type: ActionTypes.SET_LOCALE;
	payload: {
		locale?: string;
	};
}

export const setLocale = (locale?: string) => AppDispatcher.dispatch<SetLocaleAction>({
	type: ActionTypes.SET_LOCALE,
	payload: {
		locale
	}
});
