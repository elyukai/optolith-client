import * as ActionTypes from '../constants/ActionTypes';
import { getAvailableAdventurePoints } from '../selectors/adventurePointsSelectors';
import { isInCharacterCreation } from '../selectors/phaseSelectors';
import { getCombatTechniques, getLocaleMessages } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions.d';
import { _translate } from '../utils/I18n';
import { getDecreaseCost, getIncreaseCost } from '../utils/IncreasableUtils';
import { addAlert } from './AlertActions';

export interface AddCombatTechniquePointAction {
	type: ActionTypes.ADD_COMBATTECHNIQUE_POINT;
	payload: {
		id: string;
		cost: number;
	};
}

export function _addPoint(id: string): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const cost = getIncreaseCost(getCombatTechniques(state).get(id)!, getAvailableAdventurePoints(state), isInCharacterCreation(state));
		const messages = getLocaleMessages(state);
		if (messages) {
			if (!cost) {
				dispatch(addAlert({
					title: _translate(messages, 'notenoughap.title'),
					message: _translate(messages, 'notenoughap.content'),
				}));
			}
			else {
				dispatch<AddCombatTechniquePointAction>({
					type: ActionTypes.ADD_COMBATTECHNIQUE_POINT,
					payload: {
						id,
						cost
					}
				});
			}
		}
	};
}

export interface RemoveCombatTechniquePointAction {
	type: ActionTypes.REMOVE_COMBATTECHNIQUE_POINT;
	payload: {
		id: string;
		cost: number;
	};
}

export function _removePoint(id: string): AsyncAction {
	return (dispatch, getState) => {
		const cost = getDecreaseCost(getCombatTechniques(getState()).get(id)!);
		dispatch<RemoveCombatTechniquePointAction>({
			type: ActionTypes.REMOVE_COMBATTECHNIQUE_POINT,
			payload: {
				id,
				cost
			}
		});
	};
}

export interface SetCombatTechniquesSortOrderAction {
	type: ActionTypes.SET_COMBATTECHNIQUES_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export function _setSortOrder(sortOrder: string): SetCombatTechniquesSortOrderAction {
	return {
		type: ActionTypes.SET_COMBATTECHNIQUES_SORT_ORDER,
		payload: {
			sortOrder
		}
	};
}

export interface SetCombatTechniquesFilterTextAction {
	type: ActionTypes.SET_COMBAT_TECHNIQUES_FILTER_TEXT;
	payload: {
		filterText: string;
	};
}

export function setFilterText(filterText: string): SetCombatTechniquesFilterTextAction {
	return {
		type: ActionTypes.SET_COMBAT_TECHNIQUES_FILTER_TEXT,
		payload: {
			filterText
		}
	};
}
