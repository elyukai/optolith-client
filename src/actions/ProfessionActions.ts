import * as ActionTypes from '../constants/ActionTypes';
import { getCurrentProfessionId, getCurrentProfessionVariantId, getDependentInstances } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions.d';
import { Selections } from '../types/data.d';
import { getDiffCost } from '../utils/RCPUtils';

export interface SelectProfessionAction {
	type: ActionTypes.SELECT_PROFESSION;
	payload: {
		id: string;
		cost: number;
	};
}

export function _selectProfession(id: string): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const dependent = getDependentInstances(state);
		const profession = getCurrentProfessionId(state);
		const professionVariant = getCurrentProfessionVariantId(state);
		const professionDiff = getDiffCost(dependent, profession, id);
		const professionVariantDiff = getDiffCost(dependent, professionVariant);
		const cost = professionDiff + professionVariantDiff;
		dispatch<SelectProfessionAction>({
			type: ActionTypes.SELECT_PROFESSION,
			payload: {
				id,
				cost
			}
		});
	};
}

export interface SetSelectionsAction {
	type: ActionTypes.ASSIGN_RCP_OPTIONS;
	payload: Selections;
}

export function _setSelections(selections: Selections): SetSelectionsAction {
	return {
		type: ActionTypes.ASSIGN_RCP_OPTIONS,
		payload: selections
	};
}

export interface SetProfessionsSortOrderAction {
	type: ActionTypes.SET_PROFESSIONS_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export function _setProfessionsSortOrder(sortOrder: string): SetProfessionsSortOrderAction {
	return {
		type: ActionTypes.SET_PROFESSIONS_SORT_ORDER,
		payload: {
			sortOrder
		}
	};
}

export interface SetProfessionsVisibilityFilterAction {
	type: ActionTypes.SET_PROFESSIONS_VISIBILITY_FILTER;
	payload: {
		filter: string;
	};
}

export function _setProfessionsVisibilityFilter(filter: string): SetProfessionsVisibilityFilterAction {
	return {
		type: ActionTypes.SET_PROFESSIONS_VISIBILITY_FILTER,
		payload: {
			filter
		}
	};
}

export interface SetProfessionsGroupVisibilityFilterAction {
	type: ActionTypes.SET_PROFESSIONS_GROUP_VISIBILITY_FILTER;
	payload: {
		filter: number;
	};
}

export function _setProfessionsGroupVisibilityFilter(filter: number): SetProfessionsGroupVisibilityFilterAction {
	return {
		type: ActionTypes.SET_PROFESSIONS_GROUP_VISIBILITY_FILTER,
		payload: {
			filter
		}
	};
}

export interface SwitchProfessionsExpansionVisibilityFilterAction {
	type: ActionTypes.SWITCH_PROFESSIONS_EXPANSION_VISIBILITY_FILTER;
}

export function _switchProfessionsExpansionVisibilityFilter(): SwitchProfessionsExpansionVisibilityFilterAction {
	return {
		type: ActionTypes.SWITCH_PROFESSIONS_EXPANSION_VISIBILITY_FILTER
	};
}

export interface SetProfessionsFilterTextAction {
	type: ActionTypes.SET_PROFESSIONS_FILTER_TEXT;
	payload: {
		filterText: string;
	};
}

export function setFilterText(filterText: string): SetProfessionsFilterTextAction {
	return {
		type: ActionTypes.SET_PROFESSIONS_FILTER_TEXT,
		payload: {
			filterText
		}
	};
}
