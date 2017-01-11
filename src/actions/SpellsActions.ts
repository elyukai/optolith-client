import { ACTIVATE_SPELL, DEACTIVATE_SPELL, ADD_SPELL_POINT, REMOVE_SPELL_POINT, SET_SPELLS_SORT_ORDER } from '../constants/ActionTypes';

export interface ActivateSpellAction {
	type: ACTIVATE_SPELL;
	payload: {
		id: string;
	};
}

export const addToList = (id: string): ActivateSpellAction => ({
	type: ACTIVATE_SPELL,
	payload: {
		id
	}
});

export interface DeactivateSpellPointAction {
	type: DEACTIVATE_SPELL;
	payload: {
		id: string;
	};
}

export const removeFromList = (id: string): DeactivateSpellPointAction => ({
	type: DEACTIVATE_SPELL,
	payload: {
		id
	}
});

export interface AddSpellPointAction {
	type: ADD_SPELL_POINT;
	payload: {
		id: string;
	};
}

export const addPoint = (id: string): AddSpellPointAction => ({
	type: ADD_SPELL_POINT,
	payload: {
		id
	}
});

export interface RemoveSpellPointAction {
	type: REMOVE_SPELL_POINT;
	payload: {
		id: string;
	};
}

export const removePoint = (id: string): RemoveSpellPointAction => ({
	type: REMOVE_SPELL_POINT,
	payload: {
		id
	}
});

export interface SetSpellsSortOrderAction {
	type: SET_SPELLS_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export const setSortOrder = (sortOrder: string): SetSpellsSortOrderAction => ({
	type: SET_SPELLS_SORT_ORDER,
	payload: {
		sortOrder
	}
});
