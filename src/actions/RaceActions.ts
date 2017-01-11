import { SELECT_RACE, SET_RACES_SORT_ORDER, SWITCH_RACE_VALUE_VISIBILITY } from '../constants/ActionTypes';

export interface SelectRaceAction {
	type: SELECT_RACE;
	payload: {
		id: string;
	};
}

export const selectRace = (id: string): SelectRaceAction => ({
	type: SELECT_RACE,
	payload: {
		id
	}
});

export interface SetRacesSortOrderAction {
	type: SET_RACES_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export const setRacesSortOrder = (sortOrder: string): SetRacesSortOrderAction => ({
	type: SET_RACES_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export interface SwitchRaceValueVisibilityAction {
	type: SWITCH_RACE_VALUE_VISIBILITY;
}

export const switchRaceValueVisibilityFilter = (sortOrder: string): SwitchRaceValueVisibilityAction => ({
	type: SWITCH_RACE_VALUE_VISIBILITY
});
