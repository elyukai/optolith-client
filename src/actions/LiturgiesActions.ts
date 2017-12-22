import * as ActionTypes from '../constants/ActionTypes';
import { getAvailableAdventurePoints } from '../selectors/adventurePointsSelectors';
import { isInCharacterCreation } from '../selectors/phaseSelectors';
import { getLiturgicalChants, getLocaleMessages } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions.d';
import { validate } from '../utils/APUtils';
import { _translate } from '../utils/I18n';
import { getDecreaseAP, getIncreaseAP } from '../utils/ICUtils';
import { getDecreaseCost, getIncreaseCost } from '../utils/IncreasableUtils';
import { addAlert } from './AlertActions';

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
		const entry = getLiturgicalChants(state).get(id)!;
		const cost = getIncreaseAP(entry.ic);
		const validCost = validate(cost, getAvailableAdventurePoints(state), isInCharacterCreation(state));
		const messages = getLocaleMessages(state);
		if (!validCost && messages) {
			dispatch(addAlert({
				title: _translate(messages, 'notenoughap.title'),
				message: _translate(messages, 'notenoughap.content'),
			}));
		}
		else {
			dispatch<ActivateLiturgyAction>({
				type: ActionTypes.ACTIVATE_LITURGY,
				payload: {
					id,
					cost
				}
			});
		}
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
		const validCost = validate(1, getAvailableAdventurePoints(state), isInCharacterCreation(state));
		const messages = getLocaleMessages(state);
		if (!validCost && messages) {
			dispatch(addAlert({
				title: _translate(messages, 'notenoughap.title'),
				message: _translate(messages, 'notenoughap.content'),
			}));
		}
		else {
			dispatch<ActivateBlessingAction>({
				type: ActionTypes.ACTIVATE_BLESSING,
				payload: {
					id
				}
			});
		}
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
		const entry = getLiturgicalChants(state).get(id)!;
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
		const cost = getIncreaseCost(getLiturgicalChants(state).get(id)!, getAvailableAdventurePoints(state), isInCharacterCreation(state));
		const messages = getLocaleMessages(state);
		if (messages) {
			if (!cost) {
				dispatch(addAlert({
					title: _translate(messages, 'notenoughap.title'),
					message: _translate(messages, 'notenoughap.content'),
				}));
			}
			else {
				dispatch<AddLiturgyPointAction>({
					type: ActionTypes.ADD_LITURGY_POINT,
					payload: {
						id,
						cost
					}
				});
			}
		}
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
		const cost = getDecreaseCost(getLiturgicalChants(state).get(id)!);
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

export interface SetActiveLiturgicalChantsFilterTextAction {
	type: ActionTypes.SET_LITURGICAL_CHANTS_FILTER_TEXT;
	payload: {
		filterText: string;
	};
}

export function setActiveFilterText(filterText: string): SetActiveLiturgicalChantsFilterTextAction {
	return {
		type: ActionTypes.SET_LITURGICAL_CHANTS_FILTER_TEXT,
		payload: {
			filterText
		}
	};
}

export interface SetInactiveLiturgicalChantsFilterTextAction {
	type: ActionTypes.SET_INACTIVE_LITURGICAL_CHANTS_FILTER_TEXT;
	payload: {
		filterText: string;
	};
}

export function setInactiveFilterText(filterText: string): SetInactiveLiturgicalChantsFilterTextAction {
	return {
		type: ActionTypes.SET_INACTIVE_LITURGICAL_CHANTS_FILTER_TEXT,
		payload: {
			filterText
		}
	};
}
