import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';

export interface SetHigherParadeValuesAction extends Action {
	type: ActionTypes.SET_HIGHER_PARADE_VALUES;
	payload: {
		value: number;
	};
}

export const setHigherParadeValues = (value: number) => AppDispatcher.dispatch<SetHigherParadeValuesAction>({
	type: ActionTypes.SET_HIGHER_PARADE_VALUES,
	payload: {
		value,
	},
});

export interface SwitchAttributeValueLimitAction extends Action {
	type: ActionTypes.SWITCH_ATTRIBUTE_VALUE_LIMIT;
}

export const switchAttributeValueLimit = () => AppDispatcher.dispatch<SwitchAttributeValueLimitAction>({
	type: ActionTypes.SWITCH_ATTRIBUTE_VALUE_LIMIT,
});
