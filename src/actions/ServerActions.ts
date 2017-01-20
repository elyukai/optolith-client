/// <reference path="../raw.d.ts" />

import { RECEIVE_DATA_TABLES, RECEIVE_HERO_AVATAR, RECEIVE_HERO_DATA, RECEIVE_NEW_USERNAME } from '../constants/ActionTypes';
import { Hero } from '../reducers/HerolistReducer';

export interface ReceiveDataTablesAction {
	type: RECEIVE_DATA_TABLES;
	payload: {
		data: RawData;
		pending?: boolean
	};
}

export const receiveDataTables = (data: RawData): ReceiveDataTablesAction => ({
	type: RECEIVE_DATA_TABLES,
	payload: {
		data,
		pending: false
	}
});

export interface ReceiveHeroDataAction {
	type: RECEIVE_HERO_DATA;
	payload: {
		data: Hero & HeroDataRest;
		pending?: boolean
	};
}

export const receiveHeroData = (data: Hero & HeroDataRest): ReceiveHeroDataAction => ({
	type: RECEIVE_HERO_DATA,
	payload: {
		data,
		pending: false
	}
});

export interface ReceiveHeroAvatarAction {
	type: RECEIVE_HERO_AVATAR;
	payload: {
		url: string;
	};
}

export const receiveHeroAvatar = (url: string): ReceiveHeroAvatarAction => ({
	type: RECEIVE_HERO_AVATAR,
	payload: {
		url
	}
});
