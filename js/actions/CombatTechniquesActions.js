import AppDispatcher from '../dispatcher/AppDispatcher';
import APStore from '../stores/APStore';
import CombatTechniquesStore from '../stores/CombatTechniquesStore';
import ActionTypes from '../constants/ActionTypes';

var CombatTechniquesActions = {
	receiveAll: function(rawTechniques) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.RECEIVE_RAW_COMBATTECHNIQUES,
			rawTechniques
		});
	},
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
		var talent = CombatTechniquesStore.get(id);
		var costs = APStore.validate(talent.fw + 1, talent.skt);
		if (talent !== false && costs !== false) {
			AppDispatcher.dispatch({
				actionType: ActionTypes.ADD_COMBATTECHNIQUE_POINT,
				id, costs
			});
		}
	},
	removePoint: function(id) {
		var talent = CombatTechniquesStore.get(id);
		var costs = APStore.getCosts(talent.fw, talent.skt, false);
		if (talent !== false && costs !== false) {
			AppDispatcher.dispatch({
				actionType: ActionTypes.REMOVE_COMBATTECHNIQUE_POINT,
				id, costs
			});
		}
	}
};

export default CombatTechniquesActions;
