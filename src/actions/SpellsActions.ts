import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';

export interface ActivateSpellAction extends Action {
	type: ActionTypes.ACTIVATE_SPELL;
	payload: {
		id: string;
	};
}

export const addToList = (id: string) => AppDispatcher.dispatch<ActivateSpellAction>({
	type: ActionTypes.ACTIVATE_SPELL,
	payload: {
		id
	}
});

export interface DeactivateSpellAction extends Action {
	type: ActionTypes.DEACTIVATE_SPELL;
	payload: {
		id: string;
	};
}

export const removeFromList = (id: string) => AppDispatcher.dispatch<DeactivateSpellAction>({
	type: ActionTypes.DEACTIVATE_SPELL,
	payload: {
		id
	}
});

export interface AddSpellPointAction extends Action {
	type: ActionTypes.ADD_SPELL_POINT;
	payload: {
		id: string;
	};
}

export const addPoint = (id: string) => AppDispatcher.dispatch<AddSpellPointAction>({
	type: ActionTypes.ADD_SPELL_POINT,
	payload: {
		id
	}
});

export interface RemoveSpellPointAction extends Action {
	type: ActionTypes.REMOVE_SPELL_POINT;
	payload: {
		id: string;
	};
}

export const removePoint = (id: string) => AppDispatcher.dispatch<RemoveSpellPointAction>({
	type: ActionTypes.REMOVE_SPELL_POINT,
	payload: {
		id
	}
});

export interface SetSpellsSortOrderAction extends Action {
	type: ActionTypes.SET_SPELLS_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export const setSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetSpellsSortOrderAction>({
	type: ActionTypes.SET_SPELLS_SORT_ORDER,
	payload: {
		sortOrder
	}
});
