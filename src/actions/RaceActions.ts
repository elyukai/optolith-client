import * as ActionTypes from '../constants/ActionTypes';
import { AsyncAction } from '../stores/AppStore';
import { getDiffCost } from '../utils/RCPUtils';

export interface SelectRaceAction {
	type: ActionTypes.SELECT_RACE;
	payload: {
		id: string;
		cost: number;
	};
}

export function _selectRace(id: string): AsyncAction {
	return (dispatch, getState) => {
		const { dependent, rcp: { profession, professionVariant, race } } = getState().currentHero.present;
		const raceDiff = getDiffCost(dependent, race, id);
		const professionDiff = getDiffCost(dependent, profession);
		const professionVariantDiff = getDiffCost(dependent, professionVariant);
		const cost = raceDiff + professionDiff + professionVariantDiff;
		dispatch({
			type: ActionTypes.SELECT_RACE,
			payload: {
				id,
				cost
			}
		} as SelectRaceAction);
	};
}

export interface SetRacesSortOrderAction {
	type: ActionTypes.SET_RACES_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export function _setRacesSortOrder(sortOrder: string): SetRacesSortOrderAction {
	return {
		type: ActionTypes.SET_RACES_SORT_ORDER,
		payload: {
			sortOrder
		}
	};
}

export interface SwitchRaceValueVisibilityAction {
	type: ActionTypes.SWITCH_RACE_VALUE_VISIBILITY;
}

export function _switchRaceValueVisibilityFilter(): SwitchRaceValueVisibilityAction {
	return {
		type: ActionTypes.SWITCH_RACE_VALUE_VISIBILITY
	};
}
