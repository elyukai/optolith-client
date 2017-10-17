import { AddAlertAction, RemoveAlertAction } from '../actions/AlertActions';
import * as ActionTypes from '../constants/ActionTypes';
import { Alert } from '../types/data.d';

type Action = AddAlertAction | RemoveAlertAction;

export type AlertsState = Alert | null;

export function alerts(state: AlertsState = null, action: Action): AlertsState {
	switch (action.type) {
		case ActionTypes.ADD_ALERT:
			return { ...action.payload };

		case ActionTypes.REMOVE_ALERT:
			return null;

		default:
			return state;
	}
}
