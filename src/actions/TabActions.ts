import AppDispatcher from '../dispatcher/AppDispatcher';
import * as ActionTypes from '../constants/ActionTypes';

export interface ShowSectionAction {
	type: ActionTypes.SHOW_SECTION;
	payload: {
		section: 'main' | 'hero' | 'group';
		tab?: string;
	};
}

export const showSection = (section: 'main' | 'hero' | 'group', tab?: string): ShowSectionAction => ({
	type: ActionTypes.SHOW_SECTION,
	payload: {
		section,
		tab
	}
});

export interface ShowTabAction {
	type: ActionTypes.SHOW_TAB;
	payload: {
		tab: string;
	};
}

export const showTab = (tab: string): ShowTabAction => ({
	type: ActionTypes.SHOW_TAB,
	payload: {
		tab
	}
});

export default {
	showTab(tab: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.SHOW_TAB,
			tab
		});
	},
	showSection(section: string): void {
		AppDispatcher.dispatch({
			type: 'SHOW_TAB_SECTION',
			section
		});
	}
};
