import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

var ProfessionVariantActions = {
	receiveAll: function(rawProfessionVariants) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.RECEIVE_RAW_PROFESSION_VARIANTS,
			rawProfessionVariants
		});
	},
	selectProfessionVariant: function(professionVariantID) {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SELECT_PROFESSION_VARIANT,
			professionVariantID
		});
	}
};

export default ProfessionVariantActions;
