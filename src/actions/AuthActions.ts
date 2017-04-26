import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';
import * as WebAPIUtils from '../utils/WebAPIUtils';

export interface RequestRegistrationAction extends Action {
	type: ActionTypes.REQUEST_REGISTRATION;
}

export const requestRegistration = (name: string, password: string, displayName: string, email: string) => {
	WebAPIUtils.register(email, name, displayName, password);
	AppDispatcher.dispatch<RequestRegistrationAction>({
		type: ActionTypes.REQUEST_REGISTRATION
	});
};

export interface RequestLoginAction extends Action {
	type: ActionTypes.REQUEST_LOGIN;
}

export const requestLogin = (name: string, password: string) => {
	WebAPIUtils.login(name, password);
	AppDispatcher.dispatch<RequestLoginAction>({
		type: ActionTypes.REQUEST_LOGIN
	});
};

export interface RequestLogoutAction extends Action {
	type: ActionTypes.REQUEST_LOGOUT;
}

export const requestLogout = () => {
	WebAPIUtils.logout();
	AppDispatcher.dispatch<RequestLogoutAction>({
		type: ActionTypes.REQUEST_LOGOUT
	});
};

export interface RequestNewUsernameAction extends Action {
	type: ActionTypes.REQUEST_NEW_USERNAME;
}

export const requestNewUsername = (name: string) => {
	WebAPIUtils.setNewUsername(name);
	AppDispatcher.dispatch<RequestNewUsernameAction>({
		type: ActionTypes.REQUEST_NEW_USERNAME
	});
};

export interface RequestNewPasswordAction extends Action {
	type: ActionTypes.REQUEST_NEW_PASSWORD;
}

export const requestNewPassword = (name: string) => {
	WebAPIUtils.setNewUsername(name);
	AppDispatcher.dispatch<RequestNewPasswordAction>({
		type: ActionTypes.REQUEST_NEW_PASSWORD
	});
};

export interface RequestNewDisplayNameAction extends Action {
	type: ActionTypes.REQUEST_NEW_DISPLAY_NAME;
}

export const requestNewDisplayName = (name: string) => {
	WebAPIUtils.setNewUsername(name);
	AppDispatcher.dispatch<RequestNewDisplayNameAction>({
		type: ActionTypes.REQUEST_NEW_DISPLAY_NAME
	});
};

export interface RequestUserDeletionAction extends Action {
	type: ActionTypes.REQUEST_USER_DELETION;
}

export const requestUserDeletion = () => {
	WebAPIUtils.deleteAccount();
	AppDispatcher.dispatch<RequestUserDeletionAction>({
		type: ActionTypes.REQUEST_USER_DELETION
	});
};

export interface RequestPasswordResetAction extends Action {
	type: ActionTypes.REQUEST_PASSWORD_RESET;
}

export const requestPasswordReset = (password: string) => {
	WebAPIUtils.sendPasswordCode(password);
	AppDispatcher.dispatch<RequestPasswordResetAction>({
		type: ActionTypes.REQUEST_PASSWORD_RESET
	});
};

export interface RequestUsernameAction extends Action {
	type: ActionTypes.REQUEST_USERNAME;
}

export const requestUsername = (password: string) => {
	WebAPIUtils.sendUsername(password);
	AppDispatcher.dispatch<RequestUsernameAction>({
		type: ActionTypes.REQUEST_USERNAME
	});
};

export interface RequestAccountActivationEmailAction extends Action {
	type: ActionTypes.REQUEST_ACCOUNT_ACTIVATION_EMAIL;
}

export const requestAccountActivationEmail = (password: string) => {
	WebAPIUtils.sendUsername(password);
	AppDispatcher.dispatch<RequestAccountActivationEmailAction>({
		type: ActionTypes.REQUEST_ACCOUNT_ACTIVATION_EMAIL
	});
};
