import { existsSync } from 'fs';
import * as ActionTypes from '../constants/ActionTypes';
import { getHeroForSave } from '../selectors/herolistSelectors';
import { getSystemLocale } from '../selectors/I18n';
import { AsyncAction } from '../types/actions.d';
import { Hero, UIMessages, User } from '../types/data.d';
import { Raw, RawHero } from '../types/rawdata.d';
import { exportHero, importHero, loadInitialData } from '../utils/FileAPIUtils';
import { getNewIdByDate } from '../utils/IDUtils';
import { convertHero } from '../utils/VersionUtils';

interface ReceiveInitialDataActionPayload extends Raw {
	defaultLocale: string;
}

export interface ReceiveInitialDataAction {
	type: ActionTypes.RECEIVE_INITIAL_DATA;
	payload: ReceiveInitialDataActionPayload;
}

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

export function _receiveHeroImport(raw: RawHero): ReceiveImportedHeroAction {
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

export function requestHeroImport(locale: UIMessages): AsyncAction {
	return dispatch => {
		importHero(locale)
			.then(result => {
				dispatch(_receiveHeroImport(result));
			})
			.catch(err => {
				console.error(err);
			});
	};
}

export function requestHeroExport(id: string, locale: UIMessages): AsyncAction {
	return (_, getState) => {
		exportHero(getHeroForSave(getState(), id), locale);
	};
}
