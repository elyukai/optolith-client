import { ActionTypes } from '../constants/ActionTypes';
import { isDialogOpen } from '../selectors/subwindowsSelectors';
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
		const alert = isDialogOpen(getState());
		if (!alert) {
			dispatch(_setTab('imprint'));
		}
	};
}
