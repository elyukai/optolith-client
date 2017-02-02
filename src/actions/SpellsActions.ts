import { ACTIVATE_SPELL, DEACTIVATE_SPELL, ADD_SPELL_POINT, REMOVE_SPELL_POINT, SET_SPELLS_SORT_ORDER } from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const addToList = (id: string): void => AppDispatcher.dispatch(<ActivateSpellAction>{
	type: ACTIVATE_SPELL,
	payload: {
		id
	}
});

export const removeFromList = (id: string): void => AppDispatcher.dispatch(<DeactivateSpellAction>{
	type: DEACTIVATE_SPELL,
	payload: {
		id
	}
});

export const addPoint = (id: string): void => AppDispatcher.dispatch(<AddSpellPointAction>{
	type: ADD_SPELL_POINT,
	payload: {
		id
	}
});

export const removePoint = (id: string): void => AppDispatcher.dispatch(<RemoveSpellPointAction>{
	type: REMOVE_SPELL_POINT,
	payload: {
		id
	}
});

export const setSortOrder = (sortOrder: string): void => AppDispatcher.dispatch(<SetSpellsSortOrderAction>{
	type: SET_SPELLS_SORT_ORDER,
	payload: {
		sortOrder
	}
});
