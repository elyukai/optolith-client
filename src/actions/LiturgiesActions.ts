import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';

export interface ActivateLiturgyAction extends Action {
	type: ActionTypes.ACTIVATE_LITURGY;
	payload: {
		id: string;
	};
}

export const addToList = (id: string) => AppDispatcher.dispatch<ActivateLiturgyAction>({
	type: ActionTypes.ACTIVATE_LITURGY,
	payload: {
		id
	}
});

export interface DeactivateLiturgyAction extends Action {
	type: ActionTypes.DEACTIVATE_LITURGY;
	payload: {
		id: string;
	};
}

export const removeFromList = (id: string) => AppDispatcher.dispatch<DeactivateLiturgyAction>({
	type: ActionTypes.DEACTIVATE_LITURGY,
	payload: {
		id
	}
});

export interface AddLiturgyPointAction extends Action {
	type: ActionTypes.ADD_LITURGY_POINT;
	payload: {
		id: string;
	};
}

export const addPoint = (id: string) => AppDispatcher.dispatch<AddLiturgyPointAction>({
	type: ActionTypes.ADD_LITURGY_POINT,
	payload: {
		id
	}
});

export interface RemoveLiturgyPointAction extends Action {
	type: ActionTypes.REMOVE_LITURGY_POINT;
	payload: {
		id: string;
	};
}

export const removePoint = (id: string) => AppDispatcher.dispatch<RemoveLiturgyPointAction>({
	type: ActionTypes.REMOVE_LITURGY_POINT,
	payload: {
		id
	}
});

export interface SetLiturgiesSortOrderAction extends Action {
	type: ActionTypes.SET_LITURGIES_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export const setSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetLiturgiesSortOrderAction>({
	type: ActionTypes.SET_LITURGIES_SORT_ORDER,
	payload: {
		sortOrder
	}
});
