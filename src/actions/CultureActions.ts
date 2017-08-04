import * as ActionTypes from '../constants/ActionTypes';
import { store } from '../stores/AppStore';
import { getDiffCost } from '../utils/RCPUtils';

export interface SelectCultureAction {
	type: ActionTypes.SELECT_CULTURE;
	payload: {
		id: string;
		cost: number;
	};
}

export function _selectCulture(id: string): SelectCultureAction {
	const { dependent, rcp: { profession, professionVariant } } = store.getState().currentHero.present;
	const professionDiff = getDiffCost(dependent, profession);
	const professionVariantDiff = getDiffCost(dependent, professionVariant);
	const cost = professionDiff + professionVariantDiff;
	return {
		type: ActionTypes.SELECT_CULTURE,
		payload: {
			id,
			cost
		}
	};
}

export interface SetCulturesSortOrderAction {
	type: ActionTypes.SET_CULTURES_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export function _setSortOrder(sortOrder: string): SetCulturesSortOrderAction {
	return {
		type: ActionTypes.SET_CULTURES_SORT_ORDER,
		payload: {
			sortOrder
		}
	};
}

export interface SetCulturesVisibilityFilterAction {
	type: ActionTypes.SET_CULTURES_VISIBILITY_FILTER;
	payload: {
		filter: string;
	};
}

export function _setVisibilityFilter(filter: string): SetCulturesVisibilityFilterAction {
	return {
		type: ActionTypes.SET_CULTURES_VISIBILITY_FILTER,
		payload: {
			filter
		}
	};
}

export interface SwitchCultureValueVisibilityAction {
	type: ActionTypes.SWITCH_CULTURE_VALUE_VISIBILITY;
}

export function _switchValueVisibilityFilter(): SwitchCultureValueVisibilityAction {
	return {
		type: ActionTypes.SWITCH_CULTURE_VALUE_VISIBILITY
	};
}
