import * as ActionTypes from '../constants/ActionTypes';
import { AsyncAction } from '../types/actions';
import { getCurrentAlert, getItemEditorInstance } from '../selectors/stateSelectors';

export interface SetSectionAction {
	type: ActionTypes.SET_SECTION;
	payload: {
		section: 'main' | 'hero' | 'group';
		tab?: string;
	};
}

export function _setSection(section: 'main' | 'hero' | 'group', tab?: string): SetSectionAction {
	return {
		type: ActionTypes.SET_SECTION,
		payload: {
			section,
			tab
		}
	};
}

export interface SetTabAction {
	type: ActionTypes.SET_TAB;
	payload: {
		tab: string;
	};
}

export function _setTab(tab: string): SetTabAction {
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
			dispatch(_setTab('about'));
		}
	};
}
