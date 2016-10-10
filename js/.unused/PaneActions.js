import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

var PaneActions = {
	showHeroList: function() {
		AppDispatcher.dispatch({
			actionType: ActionTypes.HEROES_SHOW
		});
	},
	hideHeroList: function() {
		AppDispatcher.dispatch({
			actionType: ActionTypes.HEROES_HIDE
		});
	},
	handleCollapse: function(id) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.COLLAPSE_HEROES,
			id
		});
	}
};

export default PaneActions;
