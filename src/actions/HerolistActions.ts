import * as React from 'react';
import * as ActionTypes from '../constants/ActionTypes';
import { getHeroesForSave } from '../selectors/herolistSelectors';
import { getLocaleId } from '../selectors/localeSelectors';
import { getUISettingsState } from '../selectors/uisettingsSelectors';
import { AsyncAction } from '../stores/AppStore';
import { Hero, UIMessages } from '../types/data.d';
import { Config } from '../types/rawdata.d';
import { alert } from '../utils/alert';
import { confirm } from '../utils/confirm';
import { createOverlay } from '../utils/createOverlay';
import { saveAll } from '../utils/FileAPIUtils';
import { generateHeroSaveData } from '../utils/generateHeroSaveData';
import { _translate } from '../utils/I18n';
import { getNewIdByDate } from '../utils/IDUtils';
import { HeroCreation } from '../views/herolist/HeroCreation';
import { requestHeroExport } from './FileActions';
import { _setSection } from './LocationActions';

export interface SetHerolistSortOrderAction {
	type: ActionTypes.SET_HEROLIST_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export function _setSortOrder(sortOrder: string): SetHerolistSortOrderAction {
	return {
		type: ActionTypes.SET_HEROLIST_SORT_ORDER,
		payload: {
			sortOrder
		}
	};
}

export interface SetHerolistVisibilityFilterAction {
	type: ActionTypes.SET_HEROLIST_VISIBILITY_FILTER;
	payload: {
		filterOption: string;
	};
}

export function _setVisibilityFilter(filterOption: string): SetHerolistVisibilityFilterAction {
	return {
		type: ActionTypes.SET_HEROLIST_VISIBILITY_FILTER,
		payload: {
			filterOption
		}
	};
}

export interface CreateHeroAction {
	type: ActionTypes.CREATE_HERO;
	payload: {
		name: string;
		sex: 'm' | 'f';
		el: string;
	};
}

export function _createHero(name: string, sex: 'm' | 'f', el: string): CreateHeroAction {
	return {
		type: ActionTypes.CREATE_HERO,
		payload: {
			name,
			sex,
			el
		}
	};
}

export interface LoadHeroAction {
	type: ActionTypes.LOAD_HERO;
	payload: {
		data: Hero;
	};
}

export function _loadHero(id: string): AsyncAction {
	return (dispatch, getState) => {
		const data = getState().herolist.heroes.get(id);
		if (data) {
			dispatch({
				type: ActionTypes.LOAD_HERO,
				payload: {
					data
				}
			} as LoadHeroAction);
		}
		return;
	};
}

export function loadHeroValidate(id: string): AsyncAction {
	return (dispatch, getState) => {
		const { currentHero: { past, present: { el: { startId }} }, locale: { messages }} = getState();
		if (id && (past.length === 0 || !startId)) {
			const action = _loadHero(id);
			if (action) {
				dispatch(action);
			}
		}
		else if (id) {
			confirm(_translate(messages, 'heroes.warnings.unsavedactions.title'), _translate(messages, 'heroes.warnings.unsavedactions.text'), true).then(result => {
				if (result === true) {
					const action = _loadHero(id);
					if (action) {
						dispatch(action);
					}
				}
				else {
					dispatch(_setSection('hero'));
				}
			});
		}
	};
}

export function saveHeroes(locale: UIMessages): AsyncAction {
	return (_, getState) => {
		const state = getState();
		const config: Config = {
			...getUISettingsState(state),
			locale: getLocaleId(state)
		};
		saveAll(JSON.stringify(config), JSON.stringify(getHeroesForSave(state)), locale);
		alert(_translate(locale, 'fileapi.allsaved'));
	};
}

export interface SaveHeroAction {
	type: ActionTypes.SAVE_HERO;
	payload: {
		data: Hero;
	};
}

export function _saveHero(): AsyncAction {
	return (dispatch, getState) => {
		const {
			id = `H_${getNewIdByDate()}`,
			dateCreated = new Date(),
			dateModified,
			...other
		} = generateHeroSaveData(getState());
		const data = {
			...other,
			id,
			dateCreated,
			dateModified: new Date()
		};
		dispatch({
			type: ActionTypes.SAVE_HERO,
			payload: {
				data
			}
		} as SaveHeroAction);
	};
}

export function exportHeroValidate(id: string, locale: UIMessages): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const { currentHero: { past, present: { el: { startId }} }, locale: { messages }} = state;
		if ((past.length === 0 || !startId)) {
			requestHeroExport(id, locale);
		}
		else {
			confirm(_translate(messages, 'heroes.warnings.unsavedactions.title'), _translate(messages, 'heroes.warnings.unsavedactions.text'), true).then(result => {
				if (result === true) {
					requestHeroExport(id, locale);
				}
				else {
					dispatch(_setSection('hero'));
				}
			});
		}
	};
}

export function deleteHeroValidate(id: string | undefined): AsyncAction {
	return (dispatch, getState) => {
		const { herolist: { heroes }, locale: { messages } } = getState();
		const hero = id && heroes.get(id);
		if (id && hero) {
			confirm(_translate(messages, 'heroes.warnings.delete.title', hero.name), _translate(messages, 'heroes.warnings.delete.message'), true).then(result => {
				if (result === true) {
					dispatch(_deleteHero(id));
				}
			});
		}
	};
}

export interface DeleteHeroAction {
	type: ActionTypes.DELETE_HERO;
	payload: {
		id: string;
	};
}

export function _deleteHero(id: string): DeleteHeroAction {
	return {
		type: ActionTypes.DELETE_HERO,
		payload: {
			id
		}
	};
}

export interface DuplicateHeroAction {
	type: ActionTypes.DUPLICATE_HERO;
	payload: {
		id: string;
		newId: string;
	};
}

export function _duplicateHero(id: string): DuplicateHeroAction {
	const newId = `H_${getNewIdByDate()}`;
	return {
		type: ActionTypes.DUPLICATE_HERO,
		payload: {
			id,
			newId
		}
	};
}

export function showHeroCreation(): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const { currentHero: { past, present: { el: { all, startId }} }, locale: { messages }} = state;
		const props = {
			createHero: (name: string, sex: 'm' | 'f', el: string) => dispatch(_createHero(name, sex, el)),
			elList: [...all.values()],
			locale: messages
		};
		if ((past.length === 0 || !startId)) {
			createOverlay(React.createElement(HeroCreation, props));
		}
		else {
			confirm(_translate(messages, 'heroes.warnings.unsavedactions.title'), _translate(messages, 'heroes.warnings.unsavedactions.text'), true).then(result => {
				if (result === true) {
					createOverlay(React.createElement(HeroCreation, props));
				}
				else {
					dispatch(_setSection('hero'));
				}
			});
		}
	};
}
