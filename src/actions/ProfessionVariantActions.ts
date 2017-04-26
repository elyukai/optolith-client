import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';

export interface SelectProfessionVariantAction extends Action {
	type: ActionTypes.SELECT_PROFESSION_VARIANT;
	payload: {
		id?: string;
	};
}

export const selectProfessionVariant = (id?: string) => AppDispatcher.dispatch<SelectProfessionVariantAction>({
	type: ActionTypes.SELECT_PROFESSION_VARIANT,
	payload: {
		id
	}
});
