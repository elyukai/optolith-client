import * as ActionTypes from '../constants/ActionTypes';
import { get } from '../selectors/spellsSelectors';
import { getLocaleMessages } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions.d';
import { alert } from '../utils/alert';
import { validate } from '../utils/APUtils';
import { _translate } from '../utils/I18n';
import { getDecreaseAP, getIncreaseAP } from '../utils/ICUtils';
import { getDecreaseCost, getIncreaseCost } from '../utils/IncreasableUtils';

export interface ActivateSpellAction {
	type: ActionTypes.ACTIVATE_SPELL;
	payload: {
		id: string;
		cost: number;
	};
}

export function _addToList(id: string): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const entry = get(state.currentHero.present.dependent.spells, id)!;
		const cost = getIncreaseAP(entry.ic);
		const validCost = validate(cost, state.currentHero.present.ap);
		if (!validCost) {
			alert(_translate(getLocaleMessages(state), 'notenoughap.title'), _translate(getLocaleMessages(state), 'notenoughap.content'));
			return;
		}
		dispatch({
			type: ActionTypes.ACTIVATE_SPELL,
			payload: {
				id,
				cost
			}
		} as ActivateSpellAction);
	};
}

export interface ActivateCantripAction {
	type: ActionTypes.ACTIVATE_CANTRIP;
	payload: {
		id: string;
	};
}

export function _addCantripToList(id: string): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const validCost = validate(1, state.currentHero.present.ap);
		if (!validCost) {
			alert(_translate(getLocaleMessages(state), 'notenoughap.title'), _translate(getLocaleMessages(state), 'notenoughap.content'));
			return;
		}
		dispatch({
			type: ActionTypes.ACTIVATE_CANTRIP,
			payload: {
				id
			}
		} as ActivateCantripAction);
	};
}

export interface DeactivateSpellAction {
	type: ActionTypes.DEACTIVATE_SPELL;
	payload: {
		id: string;
		cost: number;
	};
}

export function _removeFromList(id: string): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const entry = get(state.currentHero.present.dependent.spells, id)!;
		const cost = getDecreaseAP(entry.ic);
		dispatch({
			type: ActionTypes.DEACTIVATE_SPELL,
			payload: {
				id,
				cost
			}
		} as DeactivateSpellAction);
	};
}

export interface DeactivateCantripAction {
	type: ActionTypes.DEACTIVATE_CANTRIP;
	payload: {
		id: string;
	};
}

export function _removeCantripFromList(id: string): DeactivateCantripAction {
	return {
		type: ActionTypes.DEACTIVATE_CANTRIP,
		payload: {
			id
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

export function _addPoint(id: string): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const cost = getIncreaseCost(get(state.currentHero.present.dependent.spells, id)!, state.currentHero.present.ap);
		if (!cost) {
			alert(_translate(getLocaleMessages(state), 'notenoughap.title'), _translate(getLocaleMessages(state), 'notenoughap.content'));
			return;
		}
		dispatch({
			type: ActionTypes.ADD_SPELL_POINT,
			payload: {
				id,
				cost
			}
		} as AddSpellPointAction);
	};
}

export interface RemoveSpellPointAction {
	type: ActionTypes.REMOVE_SPELL_POINT;
	payload: {
		id: string;
		cost: number;
	};
}

export function _removePoint(id: string): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const cost = getDecreaseCost(get(state.currentHero.present.dependent.spells, id)!);
		dispatch({
			type: ActionTypes.REMOVE_SPELL_POINT,
			payload: {
				id,
				cost
			}
		} as RemoveSpellPointAction);
	};
}

export interface SetSpellsSortOrderAction {
	type: ActionTypes.SET_SPELLS_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export function _setSortOrder(sortOrder: string): SetSpellsSortOrderAction {
	return {
		type: ActionTypes.SET_SPELLS_SORT_ORDER,
		payload: {
			sortOrder
		}
	};
}
