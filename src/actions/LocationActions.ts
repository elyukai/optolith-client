import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';

export interface SetSectionAction extends Action {
	type: ActionTypes.SET_SECTION;
	payload: {
		section: 'main' | 'hero' | 'group';
		tab?: string;
	};
}

export const setSection = (section: 'main' | 'hero' | 'group', tab?: string) => AppDispatcher.dispatch<SetSectionAction>({
	type: ActionTypes.SET_SECTION,
	payload: {
		section,
		tab
	}
});

export interface SetTabAction extends Action {
	type: ActionTypes.SET_TAB;
	payload: {
		tab: string;
	};
}

export const setTab = (tab: string) => AppDispatcher.dispatch<SetTabAction>({
	type: ActionTypes.SET_TAB,
	payload: {
		tab
	}
});
