import { SELECT_CULTURE, SET_CULTURES_SORT_ORDER, SET_CULTURES_VISIBILITY_FILTER, SWITCH_CULTURE_VALUE_VISIBILITY } from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const selectCulture = (id: string): void => AppDispatcher.dispatch(<SelectCultureAction>{
	type: SELECT_CULTURE,
	payload: {
		id
	}
});

export const setCulturesSortOrder = (sortOrder: string): void => AppDispatcher.dispatch(<SetCulturesSortOrderAction>{
	type: SET_CULTURES_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export const setCulturesVisibilityFilter = (filter: string): void => AppDispatcher.dispatch(<SetCulturesVisibilityFilterAction>{
	type: SET_CULTURES_VISIBILITY_FILTER,
	payload: {
		filter
	}
});

export const switchCultureValueVisibilityFilter = (sortOrder: string): void => AppDispatcher.dispatch(<SwitchCultureValueVisibilityAction>{
	type: SWITCH_CULTURE_VALUE_VISIBILITY
});
