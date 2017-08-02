import { existsSync } from 'fs';
import { Dispatch } from 'redux';
import * as ActionTypes from '../constants/ActionTypes';
import { getSystemLocale } from '../selectors/I18n';
import { AsyncAction } from '../stores/AppStore';
import { Hero, User } from '../types/data.d';
import { Raw, RawHero } from '../types/rawdata.d';
import { loadInitialData } from '../utils/FileAPIUtils';
import { getNewIdByDate } from '../utils/IDUtils';
import { convertHero } from '../utils/VersionUtils';

interface ReceiveInitialDataActionPayload extends Raw {
	defaultLocale: string;
}

export interface ReceiveInitialDataAction {
	type: ActionTypes.RECEIVE_INITIAL_DATA;
	payload: ReceiveInitialDataActionPayload;
}

export const receiveInitialData = (payload: Raw) => AppDispatcher.dispatch<ReceiveInitialDataAction>({
	type: ActionTypes.RECEIVE_INITIAL_DATA,
	payload
});

export function _receiveInitialData(payload: Raw): ReceiveInitialDataAction {
	return {
		type: ActionTypes.RECEIVE_INITIAL_DATA,
		payload: {
			...payload,
			defaultLocale: getSystemLocale()
		}
	};
}

export function requestInitialData(): AsyncAction {
	return dispatch => {
		loadInitialData()
			.then(result => {
				dispatch(_receiveInitialData(result));
			})
			.catch(err => {
				console.error(err);
			});
	};
}

export interface ReceiveImportedHeroAction {
	type: ActionTypes.RECEIVE_IMPORTED_HERO;
	payload: {
		data: Hero;
		player?: User;
	};
}

export const receiveImportedHero = (data: RawHero) => AppDispatcher.dispatch<ReceiveImportedHeroAction>({
	type: ActionTypes.RECEIVE_IMPORTED_HERO,
	payload: {
		data
	}
});

export function _receiveImportedHero(raw: RawHero): ReceiveImportedHeroAction {
	const newId = `H_${getNewIdByDate()}`;
	const { player, avatar, dateCreated, dateModified, ...other } = raw;
	const data: Hero = convertHero({
		...other,
		id: newId,
		dateCreated: new Date(dateCreated),
		dateModified: new Date(dateModified),
		avatar: avatar && existsSync(avatar.replace(/file:[\\\/]+/, '')) ? avatar : undefined
	});
	return {
		type: ActionTypes.RECEIVE_IMPORTED_HERO,
		payload: {
			data,
			player
		}
	};
}
