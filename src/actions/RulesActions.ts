import * as ActionTypes from '../constants/ActionTypes';

export interface SetHigherParadeValuesAction {
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

export function _setHigherParadeValues(value: number): SetHigherParadeValuesAction {
	return {
		type: ActionTypes.SET_HIGHER_PARADE_VALUES,
		payload: {
			value
		}
	};
}

export interface SwitchAttributeValueLimitAction {
	type: ActionTypes.SWITCH_ATTRIBUTE_VALUE_LIMIT;
}

export const switchAttributeValueLimit = () => AppDispatcher.dispatch<SwitchAttributeValueLimitAction>({
	type: ActionTypes.SWITCH_ATTRIBUTE_VALUE_LIMIT,
});

export function _switchAttributeValueLimit(): SwitchAttributeValueLimitAction {
	return {
		type: ActionTypes.SWITCH_ATTRIBUTE_VALUE_LIMIT
	};
}
