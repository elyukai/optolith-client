import { SET_SECTION, SET_TAB } from '../constants/ActionTypes';

export interface SetSectionAction {
	type: SET_SECTION;
	payload: {
		section: 'main' | 'hero' | 'group';
		tab?: string;
	};
}

export const setSection = (section: 'main' | 'hero' | 'group', tab?: string): SetSectionAction => ({
	type: SET_SECTION,
	payload: {
		section,
		tab
	}
});

export interface SetTabAction {
	type: SET_TAB;
	payload: {
		tab: string;
	};
}

export const setTab = (tab: string): SetTabAction => ({
	type: SET_TAB,
	payload: {
		tab
	}
});
