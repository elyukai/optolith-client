import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	selectProfessionVariant: function(professionVariantID) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SELECT_PROFESSION_VARIANT,
			professionVariantID
		});
	}
};
