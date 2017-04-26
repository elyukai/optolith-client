import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';
import { Selections } from '../types/data.d';

export interface SelectProfessionAction extends Action {
	type: ActionTypes.SELECT_PROFESSION;
	payload: {
		id: string;
	};
}

export const selectProfession = (id: string) => AppDispatcher.dispatch<SelectProfessionAction>({
	type: ActionTypes.SELECT_PROFESSION,
	payload: {
		id
	}
});

export interface SetSelectionsAction extends Action {
	type: ActionTypes.ASSIGN_RCP_OPTIONS;
	payload: Selections;
}

export const setSelections = (selections: Selections) => AppDispatcher.dispatch<SetSelectionsAction>({
	type: ActionTypes.ASSIGN_RCP_OPTIONS,
	payload: selections
});

export interface SetProfessionsSortOrderAction extends Action {
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

export interface SetProfessionsVisibilityFilterAction extends Action {
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

export interface SetProfessionsGroupVisibilityFilterAction extends Action {
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

export interface SwitchProfessionsExpansionVisibilityFilterAction extends Action {
	type: ActionTypes.SWITCH_PROFESSIONS_EXPANSION_VISIBILITY_FILTER;
}

export const switchProfessionsExpansionVisibilityFilter = () => AppDispatcher.dispatch<SwitchProfessionsExpansionVisibilityFilterAction>({
	type: ActionTypes.SWITCH_PROFESSIONS_EXPANSION_VISIBILITY_FILTER
});
