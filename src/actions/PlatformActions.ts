import { AsyncAction } from '../stores/AppStore';
import { ToListById } from '../types/data.d';
import { Config, RawHero } from '../types/rawdata.d';
import * as FileAPIUtils from '../utils/FileAPIUtils';

export function requestConfigSave(): AsyncAction {
	return (_, getState) => {
		const { locale: { id, messages }, ui: { settings }} = getState();
		const data: Config = {
			...settings,
			locale: id
		};
		if (messages) {
			FileAPIUtils.saveConfig(JSON.stringify(data), messages);
		}
	};
}

export function requestHeroesSave(): AsyncAction {
	return (_, getState) => {
		const { herolist: { heroes }, locale: { messages }} = getState();
		const data: ToListById<RawHero> = [...heroes].reduce((obj, [id, hero]) => {
			return { ...obj, [id]: hero };
		}, {});
		if (messages) {
			FileAPIUtils.saveAllHeroes(JSON.stringify(data), messages);
		}
	};
}

export function requestSaveAll(): AsyncAction {
	return dispatch => {
		dispatch(requestConfigSave());
		dispatch(requestHeroesSave());
	};
}
