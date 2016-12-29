import AppDispatcher from '../dispatcher/AppDispatcher';
import ActionTypes from '../constants/ActionTypes';

export default {
	selectRace(raceID: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SELECT_RACE,
			raceID
		});
	},
	filter(text: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.FILTER_RACES,
			text
		});
	},
	sort(option: string): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.SORT_RACES,
			option
		});
	},
	changeValueVisibility(): void {
		AppDispatcher.dispatch({
			actionType: ActionTypes.CHANGE_RACE_VALUE_VISIBILITY
		});
	}
};
