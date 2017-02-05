import { REQUEST_LOGIN, REQUEST_LOGOUT, REQUEST_NEW_USERNAME, REQUEST_USER_DELETION } from '../constants/ActionTypes';
import * as WebAPIUtils from '../utils/WebAPIUtils';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const requestLogin = (name: string, password: string) => {
	WebAPIUtils.login(name, password);
	AppDispatcher.dispatch<RequestLoginAction>({
		type: REQUEST_LOGIN
	});
};

export const requestLogout = () => {
	WebAPIUtils.logout();
	AppDispatcher.dispatch<RequestLogoutAction>({
		type: REQUEST_LOGOUT
	});
};

export const requestNewUsername = (name: string) => {
	WebAPIUtils.setNewUsername(name);
	AppDispatcher.dispatch<RequestNewUsernameAction>({
		type: REQUEST_NEW_USERNAME
	});
};

export const requestUserDeletion = () => {
	WebAPIUtils.deleteAccount();
	AppDispatcher.dispatch<RequestUserDeletionAction>({
		type: REQUEST_USER_DELETION
	});
};
