import * as ActionTypes from '../constants/ActionTypes';
import { getCurrentProfessionId, getCurrentProfessionVariantId, getCurrentRaceId, getDependentInstances } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions.d';
import { getDiffCost } from '../utils/RCPUtils';

export interface SelectRaceAction {
	type: ActionTypes.SELECT_RACE;
	payload: {
		id: string;
		variantId: string | undefined;
		cost: number;
	};
}

export function _selectRace(id: string, variantId?: string): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const dependent = getDependentInstances(state);
		const race = getCurrentRaceId(state);
		const profession = getCurrentProfessionId(state);
		const professionVariant = getCurrentProfessionVariantId(state);
		const raceDiff = getDiffCost(dependent, race, id);
		const professionDiff = getDiffCost(dependent, profession);
		const professionVariantDiff = getDiffCost(dependent, professionVariant);
		const cost = raceDiff + professionDiff + professionVariantDiff;
		dispatch<SelectRaceAction>({
			type: ActionTypes.SELECT_RACE,
			payload: {
				id,
				variantId,
				cost
			}
		});
	};
}

export interface SetRaceVariantAction {
	type: ActionTypes.SET_RACE_VARIANT;
	payload: {
		id: string;
		cost: number;
	};
}

export function setRaceVariant(id: string): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const dependent = getDependentInstances(state);
		const profession = getCurrentProfessionId(state);
		const professionVariant = getCurrentProfessionVariantId(state);
		const professionDiff = getDiffCost(dependent, profession);
		const professionVariantDiff = getDiffCost(dependent, professionVariant);
		const cost = professionDiff + professionVariantDiff;
		dispatch<SetRaceVariantAction>({
			type: ActionTypes.SET_RACE_VARIANT,
			payload: {
				id,
				cost
			}
		});
	};
}

export interface SetRacesSortOrderAction {
	type: ActionTypes.SET_RACES_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export function _setRacesSortOrder(sortOrder: string): SetRacesSortOrderAction {
	return {
		type: ActionTypes.SET_RACES_SORT_ORDER,
		payload: {
			sortOrder
		}
	};
}

export interface SwitchRaceValueVisibilityAction {
	type: ActionTypes.SWITCH_RACE_VALUE_VISIBILITY;
}

export function _switchRaceValueVisibilityFilter(): SwitchRaceValueVisibilityAction {
	return {
		type: ActionTypes.SWITCH_RACE_VALUE_VISIBILITY
	};
}

export interface SetRacesFilterTextAction {
	type: ActionTypes.SET_RACES_FILTER_TEXT;
	payload: {
		filterText: string;
	};
}

export function setFilterText(filterText: string): SetRacesFilterTextAction {
	return {
		type: ActionTypes.SET_RACES_FILTER_TEXT,
		payload: {
			filterText
		}
	};
}
