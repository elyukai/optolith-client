import { SET_SECTION, SET_TAB } from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const setSection = (section: 'main' | 'hero' | 'group', tab?: string) => AppDispatcher.dispatch<SetSectionAction>({
	type: SET_SECTION,
	payload: {
		section,
		tab
	}
});

export const setTab = (tab: string) => AppDispatcher.dispatch<SetTabAction>({
	type: SET_TAB,
	payload: {
		tab
	}
});
