import AppDispatcher from '../dispatcher/AppDispatcher';
import APStore from '../stores/APStore';
import SpellsStore from '../stores/SpellsStore';
import ActionTypes from '../constants/ActionTypes';

var SpellsActions = {
	filter: function(text) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.FILTER_SPELLS,
			text
		});
	},
	sort: function(option) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SORT_SPELLS,
			option
		});
	},
	changeView: function(option) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_SPELL_VIEW,
			option
		});
	},
	addToList: function(id) {
		var spell = SpellsStore.get(id);
		var costs = spell.gr === 5 ? [1] : ['aktv', spell.skt];
		costs = APStore.validate(...costs);
		if (costs) {
			AppDispatcher.dispatch({
				actionType: ActionTypes.ACTIVATE_SPELL,
				id, costs
			});
		}
	},
	removeFromList: function(id) {
		var spell = SpellsStore.get(id);
		var costs = spell.gr === 5 ? [1, undefined, false] : ['aktv', spell.skt, false];
		costs = APStore.validate(...costs);
		AppDispatcher.dispatch({
			actionType: ActionTypes.DEACTIVATE_SPELL,
			id, costs
		});
	},
	addPoint: function(id) {
		var spell = SpellsStore.get(id);
		var costs = APStore.validate(spell.fw + 1, spell.skt);
		if (costs) {
			AppDispatcher.dispatch({
				actionType: ActionTypes.ADD_SPELL_POINT,
				id, costs
			});
		}
	},
	removePoint: function(id) {
		var spell = SpellsStore.get(id);
		if (spell.fw === 0) {
			SpellsActions.removeFromList(id);
		} else {
			var costs = APStore.getCosts(spell.fw, spell.skt, false);
			if (costs) {
				AppDispatcher.dispatch({
					actionType: ActionTypes.REMOVE_SPELL_POINT,
					id, costs
				});
			}
		}
	}
};

export default SpellsActions;
