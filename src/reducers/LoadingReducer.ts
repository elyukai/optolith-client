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
		// case ActionTypes.REGISTRATION_SUCCESS:
		// case ActionTypes.CLEAR_ACCOUNT:
		// case ActionTypes.UPDATE_USERNAME:
		// case ActionTypes.CREATE_HERO:
		// case ActionTypes.SAVE_HERO_SUCCESS:
		// case ActionTypes.UPDATE_HERO_AVATAR:
			return true;

		case ActionTypes.RECEIVE_HERO_DATA:
		case ActionTypes.RECEIVE_HEROLIST:
		case ActionTypes.RECEIVE_LOGIN:
		case ActionTypes.RECEIVE_LOGOUT:
			return false;

		default:
			return state;
	}
}
