import * as ActionTypes from '../constants/ActionTypes';

export interface SetSectionAction {
	type: ActionTypes.SET_SECTION;
	payload: {
		section: 'main' | 'hero' | 'group';
		tab?: string;
	};
}

export const setSection = (section: 'main' | 'hero' | 'group', tab?: string): SetSectionAction => ({
	type: ActionTypes.SET_SECTION,
	payload: {
		section,
		tab
	}
});

export interface SetTabAction {
	type: ActionTypes.SET_TAB;
	payload: {
		tab: string;
	};
}

export const setTab = (tab: string): SetTabAction => ({
	type: ActionTypes.SET_TAB,
	payload: {
		tab
	}
});
