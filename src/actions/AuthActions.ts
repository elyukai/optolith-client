import * as ActionTypes from '../constants/ActionTypes';
import { RawHerolist } from './HerolistActions';

export interface LoginAction {
	type: ActionTypes.RECEIVE_LOGIN;
	payload: {
		name: string;
		displayName: string;
		email: string;
		sessionToken: string;
		heroes: RawHerolist
	};
}

export const login = (name: string, displayName: string, email: string, sessionToken: string, heroes: RawHerolist) => ({
	type: ActionTypes.RECEIVE_LOGIN,
	payload: {
		name,
		displayName,
		email,
		sessionToken,
		heroes
	}
});

export interface LogoutAction {
	type: ActionTypes.RECEIVE_LOGOUT;
}

export const logout = () => ({
	type: ActionTypes.RECEIVE_LOGOUT
});
