import * as ActionTypes from '../constants/ActionTypes';

export interface LoginAction {
	type: ActionTypes.LOGIN;
	payload: {
		name: string;
		displayName: string;
		email: string;
		sessionToken: string;
	};
}

export const login = (name: string, displayName: string, email: string, sessionToken: string) => ({
	type: ActionTypes.LOGIN,
	payload: {
		name,
		displayName,
		email,
		sessionToken
	}
});

export interface LogoutAction {
	type: ActionTypes.LOGOUT;
}

export const logout = () => ({
	type: ActionTypes.LOGOUT
});
