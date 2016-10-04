import AppDispatcher from '../dispatcher/AppDispatcher';
import APStore from '../stores/APStore';
import TalentsStore from '../stores/TalentsStore';
import ActionTypes from '../constants/ActionTypes';

var TalentsActions = {
	receiveAll: function(rawTalents) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.RECEIVE_RAW_TALENTS,
			rawTalents
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
			actionType: ActionTypes.SORT_TALENTS,
			option
		});
	},
	changeTalentRating: function() {
		AppDispatcher.dispatch({
			actionType: ActionTypes.CHANGE_TALENT_RATING
		});
	},
	addPoint: function(id) {
		var talent = TalentsStore.get(id);
		var costs = APStore.validate(talent.fw + 1, talent.skt);
		if (talent !== false && costs !== false) {
			AppDispatcher.dispatch({
				actionType: ActionTypes.ADD_TALENT_POINT,
				id, costs
			});
		}
	},
	removePoint: function(id) {
		var talent = TalentsStore.get(id);
		var costs = APStore.getCosts(talent.fw, talent.skt, false);
		if (talent !== false && costs !== false) {
			AppDispatcher.dispatch({
				actionType: ActionTypes.REMOVE_TALENT_POINT,
				id, costs
			});
		}
	}
};

export default TalentsActions;
