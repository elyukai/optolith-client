import * as ActionTypes from '../constants/ActionTypes';
import { getCurrentProfessionVariantId, getDependentInstances } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions.d';
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
		const state = getState();
		const dependent = getDependentInstances(state);
		const professionVariant = getCurrentProfessionVariantId(state);
		const cost = getDiffCost(dependent, professionVariant, id);
		dispatch<SelectProfessionVariantAction>({
			type: ActionTypes.SELECT_PROFESSION_VARIANT,
			payload: {
				id,
				cost
			}
		});
	};
}
