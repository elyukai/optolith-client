import * as ActionTypes from '../constants/ActionTypes';

type Action = {
	type: string;
};

export type LoadingState = boolean;

const initialState: boolean = true;

export default (state = initialState, a: Action) => {
	switch (a.type) {
		case ActionTypes.REQUEST_HERO_DATA:
		case ActionTypes.REQUEST_HEROLIST:
		case ActionTypes.REQUEST_LOGIN:
		case ActionTypes.REQUEST_LOGOUT:
		case ActionTypes.REQUEST_NEW_USERNAME:
		case ActionTypes.REQUEST_HERO_AVATAR:
		// case ActionTypes.REGISTRATION_SUCCESS:
		// case ActionTypes.CLEAR_ACCOUNT:
		// case ActionTypes.SAVE_HERO_SUCCESS:
			return true;

		case ActionTypes.RECEIVE_DATA_TABLES:
		case ActionTypes.RECEIVE_HERO_DATA:
		case ActionTypes.RECEIVE_HEROLIST:
		case ActionTypes.RECEIVE_LOGIN:
		case ActionTypes.RECEIVE_LOGOUT:
		case ActionTypes.RECEIVE_NEW_USERNAME:
		case ActionTypes.RECEIVE_HERO_AVATAR:
			return false;

		default:
			return state;
	}
}
