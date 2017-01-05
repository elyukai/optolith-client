import AppDispatcher from '../dispatcher/AppDispatcher';
import * as ActionTypes from '../constants/ActionTypes';

export interface SelectRaceAction {
	type: ActionTypes.SELECT_RACE;
	payload: {
		id: string;
	};
}

export const selectRace = (id: string) => ({
	type: ActionTypes.SELECT_RACE,
	payload: {
		id
	}
});

export interface SortRacesAction {
	type: ActionTypes.SORT_RACES;
	payload: {
		sortOrder: string;
	};
}

export const sortRaces = (sortOrder: string) => ({
	type: ActionTypes.SORT_RACES,
	payload: {
		sortOrder
	}
});

export default {
	selectRace(raceID: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.ATS.SELECT_RACE,
			raceID
		});
	},
	filter(text: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.ATS.FILTER_RACES,
			text
		});
	},
	sort(option: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.ATS.SORT_RACES,
			option
		});
	},
	changeValueVisibility(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.ATS.CHANGE_RACE_VALUE_VISIBILITY
		});
	}
};
