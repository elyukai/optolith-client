import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';

export interface SelectRaceAction extends Action {
	type: ActionTypes.SELECT_RACE;
	payload: {
		id: string;
	};
}

export const selectRace = (id: string) => AppDispatcher.dispatch<SelectRaceAction>({
	type: ActionTypes.SELECT_RACE,
	payload: {
		id
	}
});

export interface SetRacesSortOrderAction extends Action {
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

export interface SwitchRaceValueVisibilityAction extends Action {
	type: ActionTypes.SWITCH_RACE_VALUE_VISIBILITY;
}

export const switchRaceValueVisibilityFilter = () => AppDispatcher.dispatch<SwitchRaceValueVisibilityAction>({
	type: ActionTypes.SWITCH_RACE_VALUE_VISIBILITY
});
