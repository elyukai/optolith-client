import * as ActionTypes from '../constants/ActionTypes';

export interface SetSectionAction {
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

export const setTab = (tab: string) => AppDispatcher.dispatch<SetTabAction>({
	type: ActionTypes.SET_TAB,
	payload: {
		tab
	}
});

export function _setTab(tab: string): SetTabAction {
	return {
		type: ActionTypes.SET_TAB,
		payload: {
			tab
		}
	};
}
