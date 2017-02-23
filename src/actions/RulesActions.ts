import { SET_HIGHER_PARADE_VALUES } from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const setHigherParadeValues = (value: number) => AppDispatcher.dispatch<SetHigherParadeValuesAction>({
	type: SET_HIGHER_PARADE_VALUES,
	payload: {
		value
	}
});
