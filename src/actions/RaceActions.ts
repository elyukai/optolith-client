import * as ActionTypes from '../constants/ActionTypes';
import { store } from '../stores/AppStore';
import { getDiffCost } from '../utils/RCPUtils';

export interface SelectRaceAction {
	type: ActionTypes.SELECT_RACE;
	payload: {
		id: string;
		cost: number;
	};
}

export const selectRace = (id: string) => AppDispatcher.dispatch<SelectRaceAction>({
	type: ActionTypes.SELECT_RACE,
	payload: {
		id
	}
});

export function _selectRace(id: string): SelectRaceAction {
	const { dependent, rcp: { profession, professionVariant, race } } = store.getState().currentHero.present;
	const raceDiff = getDiffCost(dependent, race, id);
	const professionDiff = getDiffCost(dependent, profession);
	const professionVariantDiff = getDiffCost(dependent, professionVariant);
	const cost = raceDiff + professionDiff + professionVariantDiff;
	return {
		type: ActionTypes.SELECT_RACE,
		payload: {
			id,
			cost
		}
	};
}

export interface SetRacesSortOrderAction {
	type: ActionTypes.SET_RACES_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export const setRacesSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetRacesSortOrderAction>({
	type: ActionTypes.SET_RACES_SORT_ORDER,
	payload: {
		sortOrder
	}
});

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

export const switchRaceValueVisibilityFilter = () => AppDispatcher.dispatch<SwitchRaceValueVisibilityAction>({
	type: ActionTypes.SWITCH_RACE_VALUE_VISIBILITY
});

export function _switchRaceValueVisibilityFilter(): SwitchRaceValueVisibilityAction {
	return {
		type: ActionTypes.SWITCH_RACE_VALUE_VISIBILITY
	};
}
