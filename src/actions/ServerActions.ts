import * as ActionTypes from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const receiveDataTables = (data: RawTables) => AppDispatcher.dispatch<ReceiveDataTablesAction>({
	type: ActionTypes.RECEIVE_DATA_TABLES,
	payload: {
		data
	}
});

export const receiveHerolist = (heroes: RawHerolist) => AppDispatcher.dispatch<ReceiveHerolistAction>({
	type: ActionTypes.RECEIVE_HEROLIST,
	payload: {
		heroes
	}
});

export const receiveRegistration = () => AppDispatcher.dispatch<ReceiveRegistrationAction>({
	type: ActionTypes.RECEIVE_REGISTRATION
});

export const receiveHeroData = (data: Hero) => AppDispatcher.dispatch<ReceiveHeroDataAction>({
	type: ActionTypes.RECEIVE_HERO_DATA,
	payload: {
		data
	}
});

export const receiveHeroAvatar = (url: string) => AppDispatcher.dispatch<ReceiveHeroAvatarAction>({
	type: ActionTypes.RECEIVE_HERO_AVATAR,
	payload: {
		url
	}
});

export const receiveLogin = (name: string, displayName: string, email: string, sessionToken: string, heroes: RawHerolist) => AppDispatcher.dispatch<ReceiveLoginAction>({
	type: ActionTypes.RECEIVE_LOGIN,
	payload: {
		name,
		displayName,
		email,
		sessionToken,
		heroes
	}
});

export const receiveLogout = () => AppDispatcher.dispatch<ReceiveLogoutAction>({
	type: ActionTypes.RECEIVE_LOGOUT
});

export const receiveNewUsername = (name: string) => AppDispatcher.dispatch<ReceiveNewUsernameAction>({
	type: ActionTypes.RECEIVE_NEW_USERNAME,
	payload: {
		name
	}
});

export const receiveNewPassword = () => AppDispatcher.dispatch<ReceiveNewPasswordAction>({
	type: ActionTypes.RECEIVE_NEW_PASSWORD
});

export const receiveNewDisplayName = (name: string) => AppDispatcher.dispatch<ReceiveNewDisplayNameAction>({
	type: ActionTypes.RECEIVE_NEW_DISPLAY_NAME,
	payload: {
		name
	}
});

export const receiveUserDeletion = () => AppDispatcher.dispatch<ReceiveUserDeletionAction>({
	type: ActionTypes.RECEIVE_USER_DELETION
});

export const receivePasswordReset = () => AppDispatcher.dispatch<ReceivePasswordResetAction>({
	type: ActionTypes.RECEIVE_PASSWORD_RESET
});

export const receiveUsername = () => AppDispatcher.dispatch<ReceiveUsernameAction>({
	type: ActionTypes.RECEIVE_USERNAME
});

export const receiveAccountActivationEmail = () => AppDispatcher.dispatch<ReceiveAccountActivationEmailAction>({
	type: ActionTypes.RECEIVE_ACCOUNT_ACTIVATION_EMAIL
});
