import * as ActionTypes from '../constants/ActionTypes';
import { get } from '../selectors/dependentInstancesSelectors';
import { isInCharacterCreation } from '../selectors/phaseSelectors';
import { getLocaleMessages } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions.d';
import { CombatTechniqueInstance } from '../types/data.d';
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
		const cost = getIncreaseCost(get(state.currentHero.present.dependent, id) as CombatTechniqueInstance, state.currentHero.present.ap, isInCharacterCreation(state));
		const messages = getLocaleMessages(state);
		if (!cost && messages) {
			dispatch(addAlert({
				title: _translate(messages, 'notenoughap.title'),
				message: _translate(messages, 'notenoughap.content'),
			}));
		}
		else {
			dispatch({
				type: ActionTypes.ADD_COMBATTECHNIQUE_POINT,
				payload: {
					id,
					cost
				}
			} as AddCombatTechniquePointAction);
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
		const cost = getDecreaseCost(get(getState().currentHero.present.dependent, id) as CombatTechniqueInstance);
		dispatch({
			type: ActionTypes.REMOVE_COMBATTECHNIQUE_POINT,
			payload: {
				id,
				cost
			}
		} as RemoveCombatTechniquePointAction);
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
