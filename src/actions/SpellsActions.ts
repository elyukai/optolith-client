import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const addToList = (id: string) => AppDispatcher.dispatch<ActivateSpellAction>({
	type: ActionTypes.ACTIVATE_SPELL,
	payload: {
		id
	}
});

export const removeFromList = (id: string) => AppDispatcher.dispatch<DeactivateSpellAction>({
	type: ActionTypes.DEACTIVATE_SPELL,
	payload: {
		id
	}
});

export const addPoint = (id: string) => AppDispatcher.dispatch<AddSpellPointAction>({
	type: ActionTypes.ADD_SPELL_POINT,
	payload: {
		id
	}
});

export const removePoint = (id: string) => AppDispatcher.dispatch<RemoveSpellPointAction>({
	type: ActionTypes.REMOVE_SPELL_POINT,
	payload: {
		id
	}
});

export const setSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetSpellsSortOrderAction>({
	type: ActionTypes.SET_SPELLS_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export const switchEnableActiveItemHints = () => AppDispatcher.dispatch<SwitchEnableActiveItemHintsAction>({
	type: ActionTypes.SWITCH_ENABLE_ACTIVE_ITEM_HINTS
});
