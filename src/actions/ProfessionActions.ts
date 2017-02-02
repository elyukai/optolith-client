import { ASSIGN_RCP_OPTIONS, SELECT_PROFESSION, SET_PROFESSIONS_SORT_ORDER, SET_PROFESSIONS_VISIBILITY_FILTER } from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const selectProfession = (id: string): void => AppDispatcher.dispatch(<SelectProfessionAction>{
	type: SELECT_PROFESSION,
	payload: {
		id
	}
});

export const setSelections = (selections: Selections): void => AppDispatcher.dispatch(<SetSelectionsAction>{
	type: ASSIGN_RCP_OPTIONS,
	payload: selections
});

export const setProfessionsSortOrder = (sortOrder: string): void => AppDispatcher.dispatch(<SetProfessionsSortOrderAction>{
	type: SET_PROFESSIONS_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export const setProfessionsVisibilityFilter = (filter: string): void => AppDispatcher.dispatch(<SetProfessionsVisibilityFilterAction>{
	type: SET_PROFESSIONS_VISIBILITY_FILTER,
	payload: {
		filter
	}
});
