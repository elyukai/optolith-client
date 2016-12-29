import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	selectProfessionVariant(professionVariantID: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SELECT_PROFESSION_VARIANT,
			professionVariantID
		});
	}
};
