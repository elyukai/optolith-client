import * as ActionTypes from '../constants/ActionTypes';
import { store } from '../stores/AppStore';
import { Selections } from '../types/data.d';
import { getDiffCost } from '../utils/RCPUtils';

export interface SelectProfessionAction {
	type: ActionTypes.SELECT_PROFESSION;
	payload: {
		id: string;
		cost: number;
	};
}

export const selectProfession = (id: string) => AppDispatcher.dispatch<SelectProfessionAction>({
	type: ActionTypes.SELECT_PROFESSION,
	payload: {
		id
	}
});

export function _selectProfession(id: string): SelectProfessionAction {
	const { dependent, rcp: { profession, professionVariant } } = store.getState().currentHero.present;
	const professionDiff = getDiffCost(dependent, profession, id);
	const professionVariantDiff = getDiffCost(dependent, professionVariant);
	const cost = professionDiff + professionVariantDiff;
	return {
		type: ActionTypes.SELECT_PROFESSION,
		payload: {
			id,
			cost
		}
	};
}

export interface SetSelectionsAction {
	type: ActionTypes.ASSIGN_RCP_OPTIONS;
	payload: Selections;
}

export const setSelections = (selections: Selections) => AppDispatcher.dispatch<SetSelectionsAction>({
	type: ActionTypes.ASSIGN_RCP_OPTIONS,
	payload: selections
});

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

export const setProfessionsSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetProfessionsSortOrderAction>({
	type: ActionTypes.SET_PROFESSIONS_SORT_ORDER,
	payload: {
		sortOrder
	}
});

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

export const setProfessionsVisibilityFilter = (filter: string) => AppDispatcher.dispatch<SetProfessionsVisibilityFilterAction>({
	type: ActionTypes.SET_PROFESSIONS_VISIBILITY_FILTER,
	payload: {
		filter
	}
});

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

export const setProfessionsGroupVisibilityFilter = (filter: number) => AppDispatcher.dispatch<SetProfessionsGroupVisibilityFilterAction>({
	type: ActionTypes.SET_PROFESSIONS_GROUP_VISIBILITY_FILTER,
	payload: {
		filter
	}
});

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

export const switchProfessionsExpansionVisibilityFilter = () => AppDispatcher.dispatch<SwitchProfessionsExpansionVisibilityFilterAction>({
	type: ActionTypes.SWITCH_PROFESSIONS_EXPANSION_VISIBILITY_FILTER
});

export function _switchProfessionsExpansionVisibilityFilter(): SwitchProfessionsExpansionVisibilityFilterAction {
	return {
		type: ActionTypes.SWITCH_PROFESSIONS_EXPANSION_VISIBILITY_FILTER
	};
}
