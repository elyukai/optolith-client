import * as ActionTypes from '../constants/ActionTypes';
import { AsyncAction } from '../stores/AppStore';
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
		const { dependent, rcp: { profession, professionVariant } } = getState().currentHero.present;
		const professionDiff = getDiffCost(dependent, profession, id);
		const professionVariantDiff = getDiffCost(dependent, professionVariant);
		const cost = professionDiff + professionVariantDiff;
		dispatch({
			type: ActionTypes.SELECT_PROFESSION,
			payload: {
				id,
				cost
			}
		} as SelectProfessionAction);
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
