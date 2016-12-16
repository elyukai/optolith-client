import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	selectProfession: function(professionID) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SELECT_PROFESSION,
			professionID
		});
	},
	filter: function(text) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.FILTER_PROFESSIONS,
			text
		});
	},
	sort: function(option) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SORT_PROFESSIONS,
			option
		});
	},
	changeView: function(view) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.CHANGE_PROFESSION_VIEW,
			view
		});
	},
	assignRCPEntries: function(selections) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.ASSIGN_RCP_ENTRIES,
			selections
		});
	}
};
