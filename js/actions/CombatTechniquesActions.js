import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

var CombatTechniquesActions = {
	filter: function(text) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.FILTER_TALENTS,
			text
		});
	},
	sort: function(option) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SORT_COMBATTECHNIQUES,
			option
		});
	},
	addPoint: function(id) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.ADD_COMBATTECHNIQUE_POINT,
			id
		});
	},
	removePoint: function(id) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.REMOVE_COMBATTECHNIQUE_POINT,
			id
		});
	}
};

export default CombatTechniquesActions;
