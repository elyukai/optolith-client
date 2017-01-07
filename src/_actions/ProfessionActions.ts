import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	selectProfession(professionID: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.SELECT_PROFESSION,
			professionID
		});
	},
	filter(text: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.FILTER_PROFESSIONS,
			text
		});
	},
	sort(option: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.SORT_PROFESSIONS,
			option
		});
	},
	changeView(view: boolean): void {
		AppDispatcher.dispatch({
			type: ActionTypes.CHANGE_PROFESSION_VIEW,
			view
		});
	},
	assignRCPEntries(selections: Object): void {
		AppDispatcher.dispatch({
			type: ActionTypes.ASSIGN_RCP_ENTRIES,
			selections
		});
	}
};
