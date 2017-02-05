import { ASSIGN_RCP_OPTIONS, SELECT_PROFESSION, SET_PROFESSIONS_SORT_ORDER, SET_PROFESSIONS_VISIBILITY_FILTER } from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const selectProfession = (id: string) => AppDispatcher.dispatch<SelectProfessionAction>({
	type: SELECT_PROFESSION,
	payload: {
		id
	}
});

export const setSelections = (selections: Selections) => AppDispatcher.dispatch<SetSelectionsAction>({
	type: ASSIGN_RCP_OPTIONS,
	payload: selections
});

export const setProfessionsSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetProfessionsSortOrderAction>({
	type: SET_PROFESSIONS_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export const setProfessionsVisibilityFilter = (filter: string) => AppDispatcher.dispatch<SetProfessionsVisibilityFilterAction>({
	type: SET_PROFESSIONS_VISIBILITY_FILTER,
	payload: {
		filter
	}
});
