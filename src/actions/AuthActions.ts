import * as ActionTypes from '../constants/ActionTypes';
import { RawHero } from '../reducers/HerolistReducer';

interface Heroes {
	[id: string]: RawHero;
}

export interface LoginAction {
	type: ActionTypes.LOGIN;
	payload: {
		name: string;
		displayName: string;
		email: string;
		sessionToken: string;
		heroes: Heroes
	};
}

export const login = (name: string, displayName: string, email: string, sessionToken: string, heroes: Heroes) => ({
	type: ActionTypes.LOGIN,
	payload: {
		name,
		displayName,
		email,
		sessionToken,
		heroes
	}
});

export interface LogoutAction {
	type: ActionTypes.LOGOUT;
}

export const logout = () => ({
	type: ActionTypes.LOGOUT
});
