import * as ActionTypes from '../constants/ActionTypes';

export interface SelectRaceAction {
	type: ActionTypes.SELECT_RACE;
	payload: {
		id: string;
	};
}

export const selectRace = (id: string): SelectRaceAction => ({
	type: ActionTypes.SELECT_RACE,
	payload: {
		id
	}
});

export interface SortRacesAction {
	type: ActionTypes.SET_RACES_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export const sortRaces = (sortOrder: string): SortRacesAction => ({
	type: ActionTypes.SET_RACES_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export interface SwitchRaceValueVisibilityAction {
	type: ActionTypes.SWITCH_RACE_VALUE_VISIBILITY;
}

export const switchRaceValueVisibilityFilter = (sortOrder: string): SwitchRaceValueVisibilityAction => ({
	type: ActionTypes.SWITCH_RACE_VALUE_VISIBILITY
});
