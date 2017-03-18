import { SET_HIGHER_PARADE_VALUES, SWITCH_ATTRIBUTE_VALUE_LIMIT } from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const setHigherParadeValues = (value: number) => AppDispatcher.dispatch<SetHigherParadeValuesAction>({
	type: SET_HIGHER_PARADE_VALUES,
	payload: {
		value,
	},
});

export const switchAttributeValueLimit = () => AppDispatcher.dispatch<SwitchAttributeValueLimitAction>({
	type: SWITCH_ATTRIBUTE_VALUE_LIMIT,
});
