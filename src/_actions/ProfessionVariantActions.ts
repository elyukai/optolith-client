import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	selectProfessionVariant(professionVariantID: string) {
		AppDispatcher.dispatch({
			type: ActionTypes.SELECT_PROFESSION_VARIANT,
			professionVariantID
		});
	}
};
