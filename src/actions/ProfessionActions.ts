import { SELECT_PROFESSION, SET_PROFESSIONS_SORT_ORDER, SET_PROFESSIONS_VISIBILITY_FILTER } from '../constants/ActionTypes';

export interface SelectProfessionAction {
	type: SELECT_PROFESSION;
	payload: {
		id: string;
	};
}

export const selectProfessionRace = (id: string): SelectProfessionAction => ({
	type: SELECT_PROFESSION,
	payload: {
		id
	}
});

export interface SetProfessionsSortOrderAction {
	type: SET_PROFESSIONS_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export const setProfessionsSortOrder = (sortOrder: string): SetProfessionsSortOrderAction => ({
	type: SET_PROFESSIONS_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export interface SetProfessionsVisibilityFilterAction {
	type: SET_PROFESSIONS_VISIBILITY_FILTER;
	payload: {
		filter: string;
	};
}

export const setProfessionsVisibilityFilter = (filter: string): SetProfessionsVisibilityFilterAction => ({
	type: SET_PROFESSIONS_VISIBILITY_FILTER,
	payload: {
		filter
	}
});
