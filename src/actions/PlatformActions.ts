import { getHeroesForSave } from '../selectors/herolistSelectors';
import { getLocaleId, getMessages } from '../selectors/localeSelectors';
import { getUISettingsState } from '../selectors/uisettingsSelectors';
import { AsyncAction } from '../types/actions.d';
import { Config } from '../types/rawdata.d';
import * as FileAPIUtils from '../utils/FileAPIUtils';

export function requestConfigSave(): AsyncAction {
	return (_, getState) => {
		const state = getState();
		const data: Config = {
			...getUISettingsState(state),
			locale: getLocaleId(state)
		};
		const messages = getMessages(state);
		if (messages) {
			FileAPIUtils.saveConfig(JSON.stringify(data), messages);
		}
	};
}

export function requestHeroesSave(): AsyncAction {
	return (_, getState) => {
		const state = getState();
		const data = getHeroesForSave(state);
		const messages = getMessages(state);
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
