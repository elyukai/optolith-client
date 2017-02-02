import { RECEIVE_DATA_TABLES, RECEIVE_HERO_AVATAR, RECEIVE_HERO_DATA, RECEIVE_NEW_USERNAME } from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const receiveDataTables = (data: RawData): void => {
	const action: ReceiveDataTablesAction = {
		type: RECEIVE_DATA_TABLES,
		payload: {
			data
		}
	};
	AppDispatcher.dispatch(action);
};

export const receiveHeroData = (data: Hero & HeroRest): void => AppDispatcher.dispatch(<ReceiveHeroDataAction>{
	type: RECEIVE_HERO_DATA,
	payload: {
		data
	}
});

export const receiveHeroAvatar = (url: string): void => AppDispatcher.dispatch(<ReceiveHeroAvatarAction>{
	type: RECEIVE_HERO_AVATAR,
	payload: {
		url
	}
});
