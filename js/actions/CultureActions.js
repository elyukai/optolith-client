import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

var CultureActions = {
	receiveAll: function(rawCultures) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.RECEIVE_RAW_CULTURES,
			rawCultures
		});
	},
	selectCulture: function(cultureID) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SELECT_CULTURE,
			cultureID
		});
	},
	filter: function(text) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.FILTER_CULTURES,
			text
		});
	},
	sort: function(option) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SORT_CULTURES,
			option
		});
	},
	changeValueVisibility: function() {
		AppDispatcher.dispatch({
			actionType: ActionTypes.CHANGE_CULTURE_VALUE_VISIBILITY
		});
	},
	changeView: function(view) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.CHANGE_CULTURE_VIEW,
			view
		});
	},
	changePackage: function() {
		AppDispatcher.dispatch({
			actionType: ActionTypes.CHANGE_CULTURE_PACKAGE
		});
	},
	changeLiteracy: function() {
		AppDispatcher.dispatch({
			actionType: ActionTypes.CHANGE_CULTURE_LITERACY
		});
	}
};

export default CultureActions;
