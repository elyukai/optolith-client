import { REQUEST_LOGIN, REQUEST_LOGOUT, REQUEST_NEW_USERNAME, REQUEST_USER_DELETION, REQUEST_REGISTRATION, REQUEST_ACCOUNT_ACTIVATION_EMAIL, REQUEST_PASSWORD_RESET, REQUEST_USERNAME, REQUEST_NEW_DISPLAY_NAME, REQUEST_NEW_PASSWORD } from '../constants/ActionTypes';
import * as WebAPIUtils from '../utils/WebAPIUtils';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const requestRegistration = (name: string, password: string, displayName: string, email: string) => {
	WebAPIUtils.register(email, name, displayName, password);
	AppDispatcher.dispatch<RequestRegistrationAction>({
		type: REQUEST_REGISTRATION
	});
};

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

export const requestNewPassword = (name: string) => {
	WebAPIUtils.setNewUsername(name);
	AppDispatcher.dispatch<RequestNewPasswordAction>({
		type: REQUEST_NEW_PASSWORD
	});
};

export const requestNewDisplayName = (name: string) => {
	WebAPIUtils.setNewUsername(name);
	AppDispatcher.dispatch<RequestNewDisplayNameAction>({
		type: REQUEST_NEW_DISPLAY_NAME
	});
};

export const requestUserDeletion = () => {
	WebAPIUtils.deleteAccount();
	AppDispatcher.dispatch<RequestUserDeletionAction>({
		type: REQUEST_USER_DELETION
	});
};

export const requestPasswordReset = (password: string) => {
	WebAPIUtils.sendPasswordCode(password);
	AppDispatcher.dispatch<RequestPasswordResetAction>({
		type: REQUEST_PASSWORD_RESET
	});
};

export const requestUsername = (password: string) => {
	WebAPIUtils.sendUsername(password);
	AppDispatcher.dispatch<RequestUsernameAction>({
		type: REQUEST_USERNAME
	});
};

export const requestAccountActivationEmail = (password: string) => {
	WebAPIUtils.sendUsername(password);
	AppDispatcher.dispatch<RequestAccountActivationEmailAction>({
		type: REQUEST_ACCOUNT_ACTIVATION_EMAIL
	});
};
