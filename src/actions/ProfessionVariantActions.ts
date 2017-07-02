import * as ActionTypes from '../constants/ActionTypes';
import { store } from '../stores/AppStore';
import { getDiffCost } from '../utils/RCPUtils';

export interface SelectProfessionVariantAction {
	type: ActionTypes.SELECT_PROFESSION_VARIANT;
	payload: {
		id?: string;
		cost: number;
	};
}

export const selectProfessionVariant = (id?: string) => AppDispatcher.dispatch<SelectProfessionVariantAction>({
	type: ActionTypes.SELECT_PROFESSION_VARIANT,
	payload: {
		id
	}
});

export function _selectProfessionVariant(id?: string): SelectProfessionVariantAction {
	const { dependent, rcp: { professionVariant } } = store.getState().currentHero.present;
	const cost = getDiffCost(dependent, professionVariant, id);
	return {
		type: ActionTypes.SELECT_PROFESSION_VARIANT,
		payload: {
			id,
			cost
		}
	};
}
