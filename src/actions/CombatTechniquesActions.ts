import * as ActionTypes from '../constants/ActionTypes';
import { get } from '../selectors/dependentInstancesSelectors';
import { store } from '../stores/AppStore';
import { CombatTechniqueInstance } from '../types/data.d';
import { alert } from '../utils/alert';
import { translate } from '../utils/I18n';
import { getDecreaseCost, getIncreaseCost } from '../utils/IncreasableUtils';

export interface AddCombatTechniquePointAction {
	type: ActionTypes.ADD_COMBATTECHNIQUE_POINT;
	payload: {
		id: string;
		cost: number;
	};
}

export function _addPoint(id: string): AddCombatTechniquePointAction | undefined {
	const state = store.getState();
	const cost = getIncreaseCost(get(state.currentHero.present.dependent, id) as CombatTechniqueInstance, state.currentHero.present.ap);
	if (!cost) {
		alert(translate('notenoughap.title'), translate('notenoughap.content'));
		return;
	}
	return {
		type: ActionTypes.ADD_COMBATTECHNIQUE_POINT,
		payload: {
			id,
			cost
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

export function _removePoint(id: string): RemoveCombatTechniquePointAction {
	const state = store.getState();
	const cost = getDecreaseCost(get(state.currentHero.present.dependent, id) as CombatTechniqueInstance);
	return {
		type: ActionTypes.REMOVE_COMBATTECHNIQUE_POINT,
		payload: {
			id,
			cost
		}
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
