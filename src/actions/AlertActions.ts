import * as ActionTypes from '../constants/ActionTypes';
import { Alert } from '../types/data.d';

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

export interface RemoveAlertAction {
	type: ActionTypes.REMOVE_ALERT;
}

export function removeAlert(): RemoveAlertAction {
	return {
		type: ActionTypes.REMOVE_ALERT
	};
}
