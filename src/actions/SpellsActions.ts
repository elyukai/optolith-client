import * as ActionTypes from '../constants/ActionTypes';
import { isInCharacterCreation } from '../selectors/phaseSelectors';
import { getAdventurePoints, getLocaleMessages, getSpells } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions.d';
import { validate } from '../utils/APUtils';
import { _translate } from '../utils/I18n';
import { getDecreaseAP, getIncreaseAP } from '../utils/ICUtils';
import { getDecreaseCost, getIncreaseCost } from '../utils/IncreasableUtils';
import { addAlert } from './AlertActions';

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
		const entry = getSpells(state).get(id)!;
		const cost = getIncreaseAP(entry.ic);
		const validCost = validate(cost, getAdventurePoints(state), isInCharacterCreation(state));
		const messages = getLocaleMessages(state);
		if (!validCost && messages) {
			dispatch(addAlert({
				title: _translate(messages, 'notenoughap.title'),
				message: _translate(messages, 'notenoughap.content'),
			}));
		}
		else {
			dispatch<ActivateSpellAction>({
				type: ActionTypes.ACTIVATE_SPELL,
				payload: {
					id,
					cost
				}
			});
		}
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
		const validCost = validate(1, getAdventurePoints(state), isInCharacterCreation(state));
		const messages = getLocaleMessages(state);
		if (!validCost && messages) {
			dispatch(addAlert({
				title: _translate(messages, 'notenoughap.title'),
				message: _translate(messages, 'notenoughap.content'),
			}));
		}
		else {
			dispatch<ActivateCantripAction>({
				type: ActionTypes.ACTIVATE_CANTRIP,
				payload: {
					id
				}
			});
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

export function _removeFromList(id: string): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const entry = getSpells(state).get(id)!;
		const cost = getDecreaseAP(entry.ic);
		dispatch<DeactivateSpellAction>({
			type: ActionTypes.DEACTIVATE_SPELL,
			payload: {
				id,
				cost
			}
		});
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
		const cost = getIncreaseCost(getSpells(state).get(id)!, getAdventurePoints(state), isInCharacterCreation(state));
		const messages = getLocaleMessages(state);
		if (messages) {
			if (!cost) {
				dispatch(addAlert({
					title: _translate(messages, 'notenoughap.title'),
					message: _translate(messages, 'notenoughap.content'),
				}));
			}
			else {
				dispatch<AddSpellPointAction>({
					type: ActionTypes.ADD_SPELL_POINT,
					payload: {
						id,
						cost
					}
				});
			}
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

export function _removePoint(id: string): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const cost = getDecreaseCost(getSpells(state).get(id)!);
		dispatch<RemoveSpellPointAction>({
			type: ActionTypes.REMOVE_SPELL_POINT,
			payload: {
				id,
				cost
			}
		});
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
