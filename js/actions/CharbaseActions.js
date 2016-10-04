import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

var CharbaseActions = {
	selectRules: function(value) {
		
		AppDispatcher.dispatch({
			actionType: ActionTypes.SET_RULES,
			data: { value }
		});
		
	},
	selectGender: function(value) {
		
		AppDispatcher.dispatch({
			actionType: ActionTypes.SET_GENDER,
			data: { value }
		});
		
	},
	changeMaxGP: function(event) {
		
		AppDispatcher.dispatch({
			actionType: ActionTypes.SET_GP_MAXIMUM,
			data: { value: parseInt(event.target.value) }
		});
		
	},
	changeAttrGP: function(event) {
		
		AppDispatcher.dispatch({
			actionType: ActionTypes.SET_GP_FOR_ATTRIBUTES,
			data: { value: parseInt(event.target.value) }
		});
		
	},
	changeAttrMax: function(event) {
		
		AppDispatcher.dispatch({
			actionType: ActionTypes.SET_ATTRIBUTE_MAXIMUM,
			data: { value: parseInt(event.target.value) }
		});
		
	}
};

export default CharbaseActions;
