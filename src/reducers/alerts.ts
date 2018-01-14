import { AddAlertAction, RemoveAlertAction } from '../actions/AlertActions';
import * as ActionTypes from '../constants/ActionTypes';
import { Alert } from '../types/data.d';

type Action = AddAlertAction | RemoveAlertAction;

export type AlertsState = Alert[];

export function alerts(state: AlertsState = [], action: Action): AlertsState {
	switch (action.type) {
		case ActionTypes.ADD_ALERT:
			return [
				action.payload,
				...state
			];

		case ActionTypes.REMOVE_ALERT:
			return state.slice(1);

		default:
			return state;
	}
}
