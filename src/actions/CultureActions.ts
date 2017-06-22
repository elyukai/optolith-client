import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';

export interface SelectCultureAction extends Action {
	type: ActionTypes.SELECT_CULTURE;
	payload: {
		id: string;
	};
}

export const selectCulture = (id: string) => AppDispatcher.dispatch<SelectCultureAction>({
	type: ActionTypes.SELECT_CULTURE,
	payload: {
		id
	}
});

export function _selectCulture(id: string) {
	return {
		type: ActionTypes.SELECT_CULTURE,
		payload: {
			id
		}
	};
}

export interface SetCulturesSortOrderAction extends Action {
	type: ActionTypes.SET_CULTURES_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export const setSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetCulturesSortOrderAction>({
	type: ActionTypes.SET_CULTURES_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export function _setSortOrder(sortOrder: string) {
	return {
		type: ActionTypes.SET_CULTURES_SORT_ORDER,
		payload: {
			sortOrder
		}
	};
}

export interface SetCulturesVisibilityFilterAction extends Action {
	type: ActionTypes.SET_CULTURES_VISIBILITY_FILTER;
	payload: {
		filter: string;
	};
}

export const setVisibilityFilter = (filter: string) => AppDispatcher.dispatch<SetCulturesVisibilityFilterAction>({
	type: ActionTypes.SET_CULTURES_VISIBILITY_FILTER,
	payload: {
		filter
	}
});

export function _setVisibilityFilter(filter: string) {
	return {
		type: ActionTypes.SET_CULTURES_VISIBILITY_FILTER,
		payload: {
			filter
		}
	};
}

export interface SwitchCultureValueVisibilityAction extends Action {
	type: ActionTypes.SWITCH_CULTURE_VALUE_VISIBILITY;
}

export const switchValueVisibilityFilter = () => AppDispatcher.dispatch<SwitchCultureValueVisibilityAction>({
	type: ActionTypes.SWITCH_CULTURE_VALUE_VISIBILITY
});

export function _switchValueVisibilityFilter() {
	return {
		type: ActionTypes.SWITCH_CULTURE_VALUE_VISIBILITY
	};
}
