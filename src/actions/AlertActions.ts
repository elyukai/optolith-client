import { clipboard } from 'electron';
import { ActionTypes } from '../constants/ActionTypes';
import { Alert } from '../types/data';
import { translate, UIMessages } from '../utils/I18n';

export interface AddAlertAction {
	type: ActionTypes.ADD_ALERT;
	payload: Alert;
}

export function addAlert(options: Alert): AddAlertAction {
	return {
		type: ActionTypes.ADD_ALERT,
		payload: options
	};
}

export function addErrorAlert(options: Alert, locale: UIMessages): AddAlertAction {
	// @ts-ignore
	return {
		type: ActionTypes.ADD_ALERT,
		payload: {
			...options,
			buttons: [
				{
					label: translate(locale, 'copy'),
					dispatchOnClick: () => clipboard.writeText(options.message)
				},
				{
					label: translate(locale, 'ok')
				},
			]
		}
	};
}

export interface RemoveAlertAction {
	type: ActionTypes.REMOVE_ALERT;
}

export function removeAlert(): RemoveAlertAction {
	return {
		type: ActionTypes.REMOVE_ALERT
	};
}
