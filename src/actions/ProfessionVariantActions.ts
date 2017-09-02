import * as ActionTypes from '../constants/ActionTypes';
import { AsyncAction } from '../stores/AppStore';
import { getDiffCost } from '../utils/RCPUtils';

export interface SelectProfessionVariantAction {
	type: ActionTypes.SELECT_PROFESSION_VARIANT;
	payload: {
		id?: string;
		cost: number;
	};
}

export function _selectProfessionVariant(id?: string): AsyncAction {
	return (dispatch, getState) => {
		const { dependent, rcp: { professionVariant } } = getState().currentHero.present;
		const cost = getDiffCost(dependent, professionVariant, id);
		dispatch({
			type: ActionTypes.SELECT_PROFESSION_VARIANT,
			payload: {
				id,
				cost
			}
		} as SelectProfessionVariantAction);
	};
}
