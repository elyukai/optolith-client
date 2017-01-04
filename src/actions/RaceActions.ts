import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	selectRace(raceID: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.SELECT_RACE,
			raceID
		});
	},
	filter(text: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.FILTER_RACES,
			text
		});
	},
	sort(option: string): void {
		AppDispatcher.dispatch({
			type: ActionTypes.SORT_RACES,
			option
		});
	},
	changeValueVisibility(): void {
		AppDispatcher.dispatch({
			type: ActionTypes.CHANGE_RACE_VALUE_VISIBILITY
		});
	}
};
