import { SELECT_CULTURE, SET_CULTURES_SORT_ORDER, SET_CULTURES_VISIBILITY_FILTER, SWITCH_CULTURE_VALUE_VISIBILITY } from '../constants/ActionTypes';

export interface SelectCultureAction {
	type: SELECT_CULTURE;
	payload: {
		id: string;
	};
}

export const selectCulture = (id: string): SelectCultureAction => ({
	type: SELECT_CULTURE,
	payload: {
		id
	}
});

export interface SetCulturesSortOrderAction {
	type: SET_CULTURES_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export const setCulturesSortOrder = (sortOrder: string): SetCulturesSortOrderAction => ({
	type: SET_CULTURES_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export interface SetCulturesVisibilityFilterAction {
	type: SET_CULTURES_VISIBILITY_FILTER;
	payload: {
		filter: string;
	};
}

export const setCulturesVisibilityFilter = (filter: string): SetCulturesVisibilityFilterAction => ({
	type: SET_CULTURES_VISIBILITY_FILTER,
	payload: {
		filter
	}
});

export interface SwitchCultureValueVisibilityAction {
	type: SWITCH_CULTURE_VALUE_VISIBILITY;
}

export const switchCultureValueVisibilityFilter = (sortOrder: string): SwitchCultureValueVisibilityAction => ({
	type: SWITCH_CULTURE_VALUE_VISIBILITY
});
