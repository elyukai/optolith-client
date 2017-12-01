import { ProgressInfo } from 'builder-util-runtime';
import { AddAlertAction, RemoveAlertAction } from '../actions/AlertActions';
import { SetUpdateDownloadProgressAction } from '../actions/IOActions';
import * as ActionTypes from '../constants/ActionTypes';
import { Alert } from '../types/data.d';

type Action = AddAlertAction | RemoveAlertAction | SetUpdateDownloadProgressAction;

export interface AlertsState {
	currentAlert: Alert | null;
	updateDownloadProgress?: ProgressInfo;
}

const initialState: AlertsState = {
	currentAlert: null
};

export function alerts(state: AlertsState = initialState, action: Action): AlertsState {
	switch (action.type) {
		case ActionTypes.ADD_ALERT:
			return {
				...state,
				currentAlert: action.payload
			};

		case ActionTypes.REMOVE_ALERT:
			return {
				...state,
				currentAlert: null
			};

		case ActionTypes.SET_UPDATE_DOWNLOAD_PROGRESS:
			return {
				...state,
				updateDownloadProgress: action.payload
			};

		default:
			return state;
	}
}
