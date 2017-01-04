import { fromJS, Map } from 'immutable';
import * as ActionTypes from '../constants/ActionTypes';

type Action = {
	type: string;
	meta: {
		pending: boolean;
	};
};

export type LoadingState = boolean;

const initialState: boolean = true;

export default (state = initialState, a: Action) => {
	switch (a.type) {
		case 'TEST':
		// case ActionTypes.RECEIVE_RAW_LISTS:
		// case ActionTypes.WAIT_END:
		// case ActionTypes.REGISTRATION_SUCCESS:
		// case ActionTypes.RECEIVE_ACCOUNT:
		// case ActionTypes.LOGOUT_SUCCESS:
		// case ActionTypes.CLEAR_ACCOUNT:
		// case ActionTypes.UPDATE_USERNAME:
		// case ActionTypes.RECEIVE_RAW_HEROES:
		// case ActionTypes.CREATE_HERO:
		// case ActionTypes.RECEIVE_HERO:
		// case ActionTypes.SAVE_HERO_SUCCESS:
		// case ActionTypes.UPDATE_HERO_AVATAR:
			return a.meta.pending;

		default:
			return state;
	}
}
