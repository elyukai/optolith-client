import { ACTIVATE_LITURGY, DEACTIVATE_LITURGY, ADD_LITURGY_POINT, REMOVE_LITURGY_POINT, SET_LITURGIES_SORT_ORDER } from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const addToList = (id: string): void => AppDispatcher.dispatch(<ActivateLiturgyAction>{
	type: ACTIVATE_LITURGY,
	payload: {
		id
	}
});

export const removeFromList = (id: string): void => AppDispatcher.dispatch(<DeactivateLiturgyAction>{
	type: DEACTIVATE_LITURGY,
	payload: {
		id
	}
});

export const addPoint = (id: string): void => AppDispatcher.dispatch(<AddLiturgyPointAction>{
	type: ADD_LITURGY_POINT,
	payload: {
		id
	}
});

export const removePoint = (id: string): void => AppDispatcher.dispatch(<RemoveLiturgyPointAction>{
	type: REMOVE_LITURGY_POINT,
	payload: {
		id
	}
});

export const setSortOrder = (sortOrder: string): void => AppDispatcher.dispatch(<SetLiturgiesSortOrderAction>{
	type: SET_LITURGIES_SORT_ORDER,
	payload: {
		sortOrder
	}
});
