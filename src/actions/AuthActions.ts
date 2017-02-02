import { RECEIVE_LOGIN, RECEIVE_LOGOUT, RECEIVE_NEW_USERNAME, RECEIVE_USER_DELETION, REQUEST_LOGIN, REQUEST_LOGOUT, REQUEST_NEW_USERNAME, REQUEST_USER_DELETION } from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const requestLogin = (): void => AppDispatcher.dispatch(<RequestLoginAction>{
	type: REQUEST_LOGIN
});

export const receiveLogin = (name: string, displayName: string, email: string, sessionToken: string, heroes: RawHerolist): void => AppDispatcher.dispatch(<ReceiveLoginAction>{
	type: RECEIVE_LOGIN,
	payload: {
		name,
		displayName,
		email,
		sessionToken,
		heroes
	}
});

export const requestLogout = (): void => AppDispatcher.dispatch(<RequestLogoutAction>{
	type: REQUEST_LOGOUT
});

export const receiveLogout = (): void => AppDispatcher.dispatch(<ReceiveLogoutAction>{
	type: RECEIVE_LOGOUT
});

export const requestNewUsername = (): void => AppDispatcher.dispatch(<RequestNewUsernameAction>{
	type: REQUEST_LOGOUT
});

export const receiveNewUsername = (name: string): void => AppDispatcher.dispatch(<ReceiveNewUsernameAction>{
	type: RECEIVE_NEW_USERNAME,
	payload: {
		name
	}
});

export const requestUserDeletion = (): void => AppDispatcher.dispatch(<RequestUserDeletionAction>{
	type: REQUEST_USER_DELETION
});

export const receiveUserDeletion = (): void => AppDispatcher.dispatch(<ReceiveUserDeletionAction>{
	type: RECEIVE_USER_DELETION
});
