import { RECEIVE_DATA_TABLES, RECEIVE_REGISTRATION, RECEIVE_HERO_AVATAR, RECEIVE_HERO_DATA, RECEIVE_LOGIN, RECEIVE_LOGOUT, RECEIVE_NEW_USERNAME, RECEIVE_USER_DELETION, RECEIVE_HEROLIST } from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const receiveDataTables = (data: RawData) => AppDispatcher.dispatch<ReceiveDataTablesAction>({
	type: RECEIVE_DATA_TABLES,
	payload: {
		data
	}
});

export const receiveHerolist = (heroes: RawHerolist) => AppDispatcher.dispatch<ReceiveHerolistAction>({
	type: RECEIVE_HEROLIST,
	payload: {
		heroes
	}
});

export const receiveRegistration = () => AppDispatcher.dispatch<ReceiveRegistrationAction>({
	type: RECEIVE_REGISTRATION
});

export const receiveHeroData = (data: Hero & HeroRest) => AppDispatcher.dispatch<ReceiveHeroDataAction>({
	type: RECEIVE_HERO_DATA,
	payload: {
		data
	}
});

export const receiveHeroAvatar = (url: string) => AppDispatcher.dispatch<ReceiveHeroAvatarAction>({
	type: RECEIVE_HERO_AVATAR,
	payload: {
		url
	}
});

export const receiveLogin = (name: string, displayName: string, email: string, sessionToken: string, heroes: RawHerolist) => AppDispatcher.dispatch<ReceiveLoginAction>({
	type: RECEIVE_LOGIN,
	payload: {
		name,
		displayName,
		email,
		sessionToken,
		heroes
	}
});

export const receiveLogout = () => AppDispatcher.dispatch<ReceiveLogoutAction>({
	type: RECEIVE_LOGOUT
});

export const receiveNewUsername = (name: string) => AppDispatcher.dispatch<ReceiveNewUsernameAction>({
	type: RECEIVE_NEW_USERNAME,
	payload: {
		name
	}
});

export const receiveUserDeletion = () => AppDispatcher.dispatch<ReceiveUserDeletionAction>({
	type: RECEIVE_USER_DELETION
});
