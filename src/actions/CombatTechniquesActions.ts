import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';

export interface AddCombatTechniquePointAction extends Action {
	type: ActionTypes.ADD_COMBATTECHNIQUE_POINT;
	payload: {
		id: string;
	};
}

export const addPoint = (id: string) => AppDispatcher.dispatch<AddCombatTechniquePointAction>({
	type: ActionTypes.ADD_COMBATTECHNIQUE_POINT,
	payload: {
		id
	}
});

export function _addPoint(id: string): AddCombatTechniquePointAction {
	return {
		type: ActionTypes.ADD_COMBATTECHNIQUE_POINT,
		payload: {
			id
		}
	};
}

export interface RemoveCombatTechniquePointAction extends Action {
	type: ActionTypes.REMOVE_COMBATTECHNIQUE_POINT;
	payload: {
		id: string;
	};
}

export const removePoint = (id: string) => AppDispatcher.dispatch<RemoveCombatTechniquePointAction>({
	type: ActionTypes.REMOVE_COMBATTECHNIQUE_POINT,
	payload: {
		id
	}
});

export function _removePoint(id: string): RemoveCombatTechniquePointAction {
	return {
		type: ActionTypes.REMOVE_COMBATTECHNIQUE_POINT,
		payload: {
			id
		}
	};
}

export interface SetCombatTechniquesSortOrderAction extends Action {
	type: ActionTypes.SET_COMBATTECHNIQUES_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export const setSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetCombatTechniquesSortOrderAction>({
	type: ActionTypes.SET_COMBATTECHNIQUES_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export function _setSortOrder(sortOrder: string): SetCombatTechniquesSortOrderAction {
	return {
		type: ActionTypes.SET_COMBATTECHNIQUES_SORT_ORDER,
		payload: {
			sortOrder
		}
	};
}
