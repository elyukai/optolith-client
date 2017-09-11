import * as ActionTypes from '../constants/ActionTypes';
import { get } from '../selectors/liturgiesSelectors';
import { getLocaleMessages } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions.d';
import { alert } from '../utils/alert';
import { validate } from '../utils/APUtils';
import { _translate } from '../utils/I18n';
import { getDecreaseAP, getIncreaseAP } from '../utils/ICUtils';
import { getDecreaseCost, getIncreaseCost } from '../utils/IncreasableUtils';

export interface ActivateLiturgyAction {
	type: ActionTypes.ACTIVATE_LITURGY;
	payload: {
		id: string;
		cost: number;
	};
}

export function _addToList(id: string): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const entry = get(state.currentHero.present.dependent.liturgies, id)!;
		const cost = getIncreaseAP(entry.ic);
		const validCost = validate(cost, state.currentHero.present.ap);
		if (!validCost) {
			alert(_translate(getLocaleMessages(state), 'notenoughap.title'), _translate(getLocaleMessages(state), 'notenoughap.content'));
			return;
		}
		dispatch({
			type: ActionTypes.ACTIVATE_LITURGY,
			payload: {
				id,
				cost
			}
		} as ActivateLiturgyAction);
	};
}

export interface ActivateBlessingAction {
	type: ActionTypes.ACTIVATE_BLESSING;
	payload: {
		id: string;
	};
}

export function _addBlessingToList(id: string): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const validCost = validate(1, state.currentHero.present.ap);
		if (!validCost) {
			alert(_translate(getLocaleMessages(state), 'notenoughap.title'), _translate(getLocaleMessages(state), 'notenoughap.content'));
			return;
		}
		dispatch({
			type: ActionTypes.ACTIVATE_BLESSING,
			payload: {
				id
			}
		} as ActivateBlessingAction);
	};
}

export interface DeactivateLiturgyAction {
	type: ActionTypes.DEACTIVATE_LITURGY;
	payload: {
		id: string;
		cost: number;
	};
}

export function _removeFromList(id: string): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const entry = get(state.currentHero.present.dependent.liturgies, id)!;
		const cost = getDecreaseAP(entry.ic);
		dispatch({
			type: ActionTypes.DEACTIVATE_LITURGY,
			payload: {
				id,
				cost
			}
		} as DeactivateLiturgyAction);
	};
}

export interface DeactivateBlessingAction {
	type: ActionTypes.DEACTIVATE_BLESSING;
	payload: {
		id: string;
	};
}

export function _removeBlessingFromList(id: string): DeactivateBlessingAction {
	return {
		type: ActionTypes.DEACTIVATE_BLESSING,
		payload: {
			id
		}
	};
}

export interface AddLiturgyPointAction {
	type: ActionTypes.ADD_LITURGY_POINT;
	payload: {
		id: string;
		cost: number;
	};
}

export function _addPoint(id: string): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const cost = getIncreaseCost(get(state.currentHero.present.dependent.liturgies, id)!, state.currentHero.present.ap);
		if (!cost) {
			alert(_translate(getLocaleMessages(state), 'notenoughap.title'), _translate(getLocaleMessages(state), 'notenoughap.content'));
			return;
		}
		dispatch({
			type: ActionTypes.ADD_LITURGY_POINT,
			payload: {
				id,
				cost
			}
		} as AddLiturgyPointAction);
	};
}

export interface RemoveLiturgyPointAction {
	type: ActionTypes.REMOVE_LITURGY_POINT;
	payload: {
		id: string;
		cost: number;
	};
}

export function _removePoint(id: string): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const cost = getDecreaseCost(get(state.currentHero.present.dependent.liturgies, id)!);
		dispatch({
			type: ActionTypes.REMOVE_LITURGY_POINT,
			payload: {
				id,
				cost
			}
		} as RemoveLiturgyPointAction);
	};
}

export interface SetLiturgiesSortOrderAction {
	type: ActionTypes.SET_LITURGIES_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export function _setSortOrder(sortOrder: string): SetLiturgiesSortOrderAction {
	return {
		type: ActionTypes.SET_LITURGIES_SORT_ORDER,
		payload: {
			sortOrder
		}
	};
}
