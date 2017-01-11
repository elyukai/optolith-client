import { ACTIVATE_LITURGY, DEACTIVATE_LITURGY, ADD_LITURGY_POINT, REMOVE_LITURGY_POINT, SET_LITURGIES_SORT_ORDER } from '../constants/ActionTypes';

export interface ActivateLiturgyAction {
	type: ACTIVATE_LITURGY;
	payload: {
		id: string;
	};
}

export const addToList = (id: string): ActivateLiturgyAction => ({
	type: ACTIVATE_LITURGY,
	payload: {
		id
	}
});

export interface DeactivateLiturgyPointAction {
	type: DEACTIVATE_LITURGY;
	payload: {
		id: string;
	};
}

export const removeFromList = (id: string): DeactivateLiturgyPointAction => ({
	type: DEACTIVATE_LITURGY,
	payload: {
		id
	}
});

export interface AddLiturgyPointAction {
	type: ADD_LITURGY_POINT;
	payload: {
		id: string;
	};
}

export const addPoint = (id: string): AddLiturgyPointAction => ({
	type: ADD_LITURGY_POINT,
	payload: {
		id
	}
});

export interface RemoveLiturgyPointAction {
	type: REMOVE_LITURGY_POINT;
	payload: {
		id: string;
	};
}

export const removePoint = (id: string): RemoveLiturgyPointAction => ({
	type: REMOVE_LITURGY_POINT,
	payload: {
		id
	}
});

export interface SetLiturgiesSortOrderAction {
	type: SET_LITURGIES_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export const setSortOrder = (sortOrder: string): SetLiturgiesSortOrderAction => ({
	type: SET_LITURGIES_SORT_ORDER,
	payload: {
		sortOrder
	}
});
