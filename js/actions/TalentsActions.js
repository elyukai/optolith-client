import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

var TalentsActions = {
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
		AppDispatcher.dispatch({
			actionType: ActionTypes.ADD_TALENT_POINT,
			id
		});
	},
	removePoint: function(id) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.REMOVE_TALENT_POINT,
			id
		});
	}
};

export default TalentsActions;
