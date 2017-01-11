import { RECEIVE_LOGIN, RECEIVE_LOGOUT } from '../constants/ActionTypes';
import { RawHerolist } from './HerolistActions';

export interface LoginAction {
	type: RECEIVE_LOGIN;
	payload: {
		name: string;
		displayName: string;
		email: string;
		sessionToken: string;
		heroes: RawHerolist
	};
}

export const login = (name: string, displayName: string, email: string, sessionToken: string, heroes: RawHerolist): LoginAction => ({
	type: RECEIVE_LOGIN,
	payload: {
		name,
		displayName,
		email,
		sessionToken,
		heroes
	}
});

export interface LogoutAction {
	type: RECEIVE_LOGOUT;
}

export const logout = (): LogoutAction => ({
	type: RECEIVE_LOGOUT
});
