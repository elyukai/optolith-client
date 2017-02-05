import { SELECT_CULTURE, SET_CULTURES_SORT_ORDER, SET_CULTURES_VISIBILITY_FILTER, SWITCH_CULTURE_VALUE_VISIBILITY } from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const select = (id: string) => AppDispatcher.dispatch<SelectCultureAction>({
	type: SELECT_CULTURE,
	payload: {
		id
	}
});

export const setSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetCulturesSortOrderAction>({
	type: SET_CULTURES_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export const setVisibilityFilter = (filter: string) => AppDispatcher.dispatch<SetCulturesVisibilityFilterAction>({
	type: SET_CULTURES_VISIBILITY_FILTER,
	payload: {
		filter
	}
});

export const switchValueVisibilityFilter = () => AppDispatcher.dispatch<SwitchCultureValueVisibilityAction>({
	type: SWITCH_CULTURE_VALUE_VISIBILITY
});
