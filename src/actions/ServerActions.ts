import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';
import { Hero } from '../types/data.d';
import { RawHerolist, RawTables } from '../types/rawdata.d';

export interface ReceiveDataTablesAction extends Action {
	type: ActionTypes.RECEIVE_DATA_TABLES;
	payload: {
		data: RawTables;
	};
}

export const receiveDataTables = (data: RawTables) => AppDispatcher.dispatch<ReceiveDataTablesAction>({
	type: ActionTypes.RECEIVE_DATA_TABLES,
	payload: {
		data
	}
});

export interface ReceiveHerolistAction extends Action {
	type: ActionTypes.RECEIVE_HEROLIST;
	payload: {
		heroes: RawHerolist;
	};
}

export const receiveHerolist = (heroes: RawHerolist) => AppDispatcher.dispatch<ReceiveHerolistAction>({
	type: ActionTypes.RECEIVE_HEROLIST,
	payload: {
		heroes
	}
});

export interface ReceiveRegistrationAction extends Action {
	type: ActionTypes.RECEIVE_REGISTRATION;
}

export const receiveRegistration = () => AppDispatcher.dispatch<ReceiveRegistrationAction>({
	type: ActionTypes.RECEIVE_REGISTRATION
});

export interface ReceiveHeroDataAction extends Action {
	type: ActionTypes.RECEIVE_HERO_DATA;
	payload: {
		data: Hero;
	};
}

export const receiveHeroData = (data: Hero) => AppDispatcher.dispatch<ReceiveHeroDataAction>({
	type: ActionTypes.RECEIVE_HERO_DATA,
	payload: {
		data
	}
});

export interface RequestHeroAvatarAction extends Action {
	type: ActionTypes.REQUEST_HERO_AVATAR;
}

export interface ReceiveHeroAvatarAction extends Action {
	type: ActionTypes.RECEIVE_HERO_AVATAR;
	payload: {
		url: string;
	};
}

export const receiveHeroAvatar = (url: string) => AppDispatcher.dispatch<ReceiveHeroAvatarAction>({
	type: ActionTypes.RECEIVE_HERO_AVATAR,
	payload: {
		url
	}
});

export interface ReceiveLoginAction extends Action {
	type: ActionTypes.RECEIVE_LOGIN;
	payload: {
		name: string;
		displayName: string;
		email: string;
		sessionToken: string;
		heroes: RawHerolist;
	};
}

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

export interface ReceiveLogoutAction extends Action {
	type: ActionTypes.RECEIVE_LOGOUT;
}

export const receiveLogout = () => AppDispatcher.dispatch<ReceiveLogoutAction>({
	type: ActionTypes.RECEIVE_LOGOUT
});

export interface ReceiveNewUsernameAction extends Action {
	type: ActionTypes.RECEIVE_NEW_USERNAME;
	payload: {
		name: string;
	};
}

export const receiveNewUsername = (name: string) => AppDispatcher.dispatch<ReceiveNewUsernameAction>({
	type: ActionTypes.RECEIVE_NEW_USERNAME,
	payload: {
		name
	}
});

export interface ReceiveNewPasswordAction extends Action {
	type: ActionTypes.RECEIVE_NEW_PASSWORD;
}

export const receiveNewPassword = () => AppDispatcher.dispatch<ReceiveNewPasswordAction>({
	type: ActionTypes.RECEIVE_NEW_PASSWORD
});

export interface ReceiveNewDisplayNameAction extends Action {
	type: ActionTypes.RECEIVE_NEW_DISPLAY_NAME;
	payload: {
		name: string;
	};
}

export const receiveNewDisplayName = (name: string) => AppDispatcher.dispatch<ReceiveNewDisplayNameAction>({
	type: ActionTypes.RECEIVE_NEW_DISPLAY_NAME,
	payload: {
		name
	}
});

export interface ReceiveUserDeletionAction extends Action {
	type: ActionTypes.RECEIVE_USER_DELETION;
}

export const receiveUserDeletion = () => AppDispatcher.dispatch<ReceiveUserDeletionAction>({
	type: ActionTypes.RECEIVE_USER_DELETION
});

export interface ReceivePasswordResetAction extends Action {
	type: ActionTypes.RECEIVE_PASSWORD_RESET;
}

export const receivePasswordReset = () => AppDispatcher.dispatch<ReceivePasswordResetAction>({
	type: ActionTypes.RECEIVE_PASSWORD_RESET
});

export interface ReceiveUsernameAction extends Action {
	type: ActionTypes.RECEIVE_USERNAME;
}

export const receiveUsername = () => AppDispatcher.dispatch<ReceiveUsernameAction>({
	type: ActionTypes.RECEIVE_USERNAME
});

export interface ReceiveAccountActivationEmailAction extends Action {
	type: ActionTypes.RECEIVE_ACCOUNT_ACTIVATION_EMAIL;
}

export const receiveAccountActivationEmail = () => AppDispatcher.dispatch<ReceiveAccountActivationEmailAction>({
	type: ActionTypes.RECEIVE_ACCOUNT_ACTIVATION_EMAIL
});

export interface RequestFailedAction extends Action {
	type: ActionTypes.REQUEST_FAILED;
}
