import * as ActionTypes from '../constants/ActionTypes';
import { getCurrentAlert } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions';
import { TabId } from '../utils/LocationUtils';

export interface SetTabAction {
	type: ActionTypes.SET_TAB;
	payload: {
		tab: TabId;
	};
}

export function _setTab(tab: TabId): SetTabAction {
	return {
		type: ActionTypes.SET_TAB,
		payload: {
			tab
		}
	};
}

export function showAbout(): AsyncAction {
	return (dispatch, getState) => {
		const alert = getCurrentAlert(getState());
		if (alert === null) {
			dispatch(_setTab('imprint'));
		}
	};
}
