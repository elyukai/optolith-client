import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const selectProfession = (id: string) => AppDispatcher.dispatch<SelectProfessionAction>({
	type: ActionTypes.SELECT_PROFESSION,
	payload: {
		id
	}
});

export const setSelections = (selections: Selections) => AppDispatcher.dispatch<SetSelectionsAction>({
	type: ActionTypes.ASSIGN_RCP_OPTIONS,
	payload: selections
});

export const setProfessionsSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetProfessionsSortOrderAction>({
	type: ActionTypes.SET_PROFESSIONS_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export const setProfessionsVisibilityFilter = (filter: string) => AppDispatcher.dispatch<SetProfessionsVisibilityFilterAction>({
	type: ActionTypes.SET_PROFESSIONS_VISIBILITY_FILTER,
	payload: {
		filter
	}
});

export const setProfessionsGroupVisibilityFilter = (filter: number) => AppDispatcher.dispatch<SetProfessionsGroupVisibilityFilterAction>({
	type: ActionTypes.SET_PROFESSIONS_GROUP_VISIBILITY_FILTER,
	payload: {
		filter
	}
});

export const switchProfessionsExpansionVisibilityFilter = () => AppDispatcher.dispatch<SwitchProfessionsExpansionVisibilityFilterAction>({
	type: ActionTypes.SWITCH_PROFESSIONS_EXPANSION_VISIBILITY_FILTER
});
