import { ADD_COMBATTECHNIQUE_POINT, REMOVE_COMBATTECHNIQUE_POINT, SET_COMBATTECHNIQUES_SORT_ORDER } from '../constants/ActionTypes';

export interface AddCombatTechniquePointAction {
	type: ADD_COMBATTECHNIQUE_POINT;
	payload: {
		id: string;
	};
}

export const addPoint = (id: string): AddCombatTechniquePointAction => ({
	type: ADD_COMBATTECHNIQUE_POINT,
	payload: {
		id
	}
});

export interface RemoveCombatTechniquePointAction {
	type: REMOVE_COMBATTECHNIQUE_POINT;
	payload: {
		id: string;
	};
}

export const removePoint = (id: string): RemoveCombatTechniquePointAction => ({
	type: REMOVE_COMBATTECHNIQUE_POINT,
	payload: {
		id
	}
});

export interface SetCombatTechniquesSortOrderAction {
	type: SET_COMBATTECHNIQUES_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export const setSortOrder = (sortOrder: string): SetCombatTechniquesSortOrderAction => ({
	type: SET_COMBATTECHNIQUES_SORT_ORDER,
	payload: {
		sortOrder
	}
});
