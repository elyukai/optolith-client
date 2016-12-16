import AppDispatcher from '../dispatcher/AppDispatcher';
import APStore from '../stores/APStore';
import LiturgiesStore from '../stores/LiturgiesStore';
import ActionTypes from '../constants/ActionTypes';

export default {
	filter: function(text) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.FILTER_LITURGIES,
			text
		});
	},
	sort: function(option) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SORT_LITURGIES,
			option
		});
	},
	changeView: function(option) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.UPDATE_LITURGY_VIEW,
			option
		});
	},
	addToList: function(id) {
		var liturgy = LiturgiesStore.get(id);
		var costs = liturgy.gr === 3 ? [1] : ['aktv', liturgy.skt];
		costs = APStore.validate(...costs);
		if (costs) {
			AppDispatcher.dispatch({
				actionType: ActionTypes.ACTIVATE_LITURGY,
				id, costs
			});
		}
	},
	removeFromList: function(id) {
		var liturgy = LiturgiesStore.get(id);
		var costs = liturgy.gr === 3 ? [1, undefined, false] : ['aktv', liturgy.skt, false];
		costs = APStore.validate(...costs);
		AppDispatcher.dispatch({
			actionType: ActionTypes.DEACTIVATE_LITURGY,
			id, costs
		});
	},
	addPoint: function(id) {
		var liturgy = LiturgiesStore.get(id);
		var costs = APStore.validate(liturgy.fw + 1, liturgy.skt);
		if (costs) {
			AppDispatcher.dispatch({
				actionType: ActionTypes.ADD_LITURGY_POINT,
				id, costs
			});
		}
	},
	removePoint: function(id) {
		var liturgy = LiturgiesStore.get(id);
		if (liturgy.fw === 0) {
			this.removeFromList(id);
		} else {
			var costs = APStore.getCosts(liturgy.fw, liturgy.skt, false);
			if (costs) {
				AppDispatcher.dispatch({
					actionType: ActionTypes.REMOVE_LITURGY_POINT,
					id, costs
				});
			}
		}
	}
};
