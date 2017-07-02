import * as ActionTypes from '../constants/ActionTypes';
import { SPELLS } from '../constants/Categories';
import { get } from '../reducers/dependentInstances';
import { store } from '../stores/AppStore';
import { CantripInstance, SpellInstance } from '../types/data.d';
import { alert } from '../utils/alert';
import { validate } from '../utils/APUtils';
import { translate } from '../utils/I18n';
import { getDecreaseAP, getIncreaseAP } from '../utils/ICUtils';
import { getDecreaseCost, getIncreaseCost } from '../utils/IncreasableUtils';

export interface ActivateSpellAction {
	type: ActionTypes.ACTIVATE_SPELL;
	payload: {
		id: string;
		cost: number;
	};
}

export const addToList = (id: string) => AppDispatcher.dispatch<ActivateSpellAction>({
	type: ActionTypes.ACTIVATE_SPELL,
	payload: {
		id
	}
});

export function _addToList(id: string): ActivateSpellAction | undefined {
	const state = store.getState();
	const entry = get(state.currentHero.present.dependent, id) as SpellInstance | CantripInstance;
	const cost = entry.category === SPELLS ? getIncreaseAP(entry.ic) : 1;
	const validCost = validate(cost, state.currentHero.present.ap);
	if (!validCost) {
		alert(translate('notenoughap.title'), translate('notenoughap.content'));
		return;
	}
	return {
		type: ActionTypes.ACTIVATE_SPELL,
		payload: {
			id,
			cost
		}
	};
}

export interface DeactivateSpellAction {
	type: ActionTypes.DEACTIVATE_SPELL;
	payload: {
		id: string;
		cost: number;
	};
}

export const removeFromList = (id: string) => AppDispatcher.dispatch<DeactivateSpellAction>({
	type: ActionTypes.DEACTIVATE_SPELL,
	payload: {
		id
	}
});

export function _removeFromList(id: string): DeactivateSpellAction {
	const state = store.getState();
	const entry = get(state.currentHero.present.dependent, id) as SpellInstance | CantripInstance;
	const cost = entry.category === SPELLS ? getDecreaseAP(entry.ic) : 1;
	return {
		type: ActionTypes.DEACTIVATE_SPELL,
		payload: {
			id,
			cost
		}
	};
}

export interface AddSpellPointAction {
	type: ActionTypes.ADD_SPELL_POINT;
	payload: {
		id: string;
		cost: number;
	};
}

export const addPoint = (id: string) => AppDispatcher.dispatch<AddSpellPointAction>({
	type: ActionTypes.ADD_SPELL_POINT,
	payload: {
		id
	}
});

export function _addPoint(id: string): AddSpellPointAction | undefined {
	const state = store.getState();
	const cost = getIncreaseCost(get(state.currentHero.present.dependent, id) as SpellInstance, state.currentHero.present.ap);
	if (!cost) {
		alert(translate('notenoughap.title'), translate('notenoughap.content'));
		return;
	}
	return {
		type: ActionTypes.ADD_SPELL_POINT,
		payload: {
			id,
			cost
		}
	};
}

export interface RemoveSpellPointAction {
	type: ActionTypes.REMOVE_SPELL_POINT;
	payload: {
		id: string;
		cost: number;
	};
}

export const removePoint = (id: string) => AppDispatcher.dispatch<RemoveSpellPointAction>({
	type: ActionTypes.REMOVE_SPELL_POINT,
	payload: {
		id
	}
});

export function _removePoint(id: string): RemoveSpellPointAction {
	const state = store.getState();
	const cost = getDecreaseCost(get(state.currentHero.present.dependent, id) as SpellInstance);
	return {
		type: ActionTypes.REMOVE_SPELL_POINT,
		payload: {
			id,
			cost
		}
	};
}

export interface SetSpellsSortOrderAction {
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

export function _setSortOrder(sortOrder: string): SetSpellsSortOrderAction {
	return {
		type: ActionTypes.SET_SPELLS_SORT_ORDER,
		payload: {
			sortOrder
		}
	};
}
