import { RECEIVE_LOGIN, RECEIVE_LOGOUT, RECEIVE_NEW_USERNAME, RECEIVE_USER_DELETION, REQUEST_LOGIN, REQUEST_LOGOUT, REQUEST_NEW_USERNAME, REQUEST_USER_DELETION } from '../constants/ActionTypes';
import { RawHerolist } from './HerolistActions';

export interface RequestLoginAction {
	type: REQUEST_LOGIN;
}

export const requestLogin = (): RequestLoginAction => ({
	type: REQUEST_LOGIN
});

export interface ReceiveLoginAction {
	type: RECEIVE_LOGIN;
	payload: {
		name: string;
		displayName: string;
		email: string;
		sessionToken: string;
		heroes: RawHerolist
	};
}

export const receiveLogin = (name: string, displayName: string, email: string, sessionToken: string, heroes: RawHerolist): ReceiveLoginAction => ({
	type: RECEIVE_LOGIN,
	payload: {
		name,
		displayName,
		email,
		sessionToken,
		heroes
	}
});

export interface RequestLogoutAction {
	type: REQUEST_LOGOUT;
}

export const requestLogout = (): RequestLogoutAction => ({
	type: REQUEST_LOGOUT
});

export interface ReceiveLogoutAction {
	type: RECEIVE_LOGOUT;
}

export const receiveLogout = (): ReceiveLogoutAction => ({
	type: RECEIVE_LOGOUT
});

export interface RequestNewUsernameAction {
	type: REQUEST_LOGOUT;
}

export const requestNewUsername = (): RequestNewUsernameAction => ({
	type: REQUEST_LOGOUT
});

export interface ReceiveNewUsernameAction {
	type: RECEIVE_NEW_USERNAME;
	payload: {
		name: string;
	}
}

export const receiveNewUsername = (name: string): ReceiveNewUsernameAction => ({
	type: RECEIVE_NEW_USERNAME,
	payload: {
		name
	}
});

export interface RequestUserDeletionAction {
	type: REQUEST_USER_DELETION;
}

export const requestUserDeletion = (): RequestUserDeletionAction => ({
	type: REQUEST_USER_DELETION
});

export interface ReceiveUserDeletionAction {
	type: RECEIVE_USER_DELETION;
}

export const receiveUserDeletion = (): ReceiveUserDeletionAction => ({
	type: RECEIVE_USER_DELETION
});
