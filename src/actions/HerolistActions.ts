import * as ActionTypes from '../constants/ActionTypes';
import { getMessages } from '../selectors/localeSelectors';
import { getTheme } from '../selectors/uisettingsSelectors';
import { AsyncAction } from '../types/actions.d';
import { Hero, UIMessages } from '../types/data.d';
import { alert } from '../utils/alertNew';
import { confirm } from '../utils/confirm';
import { generateHeroSaveData } from '../utils/generateHeroSaveData';
import { _translate } from '../utils/I18n';
import { getNewIdByDate } from '../utils/IDUtils';
import { requestHeroExport } from './FileActions';
import { _setSection } from './LocationActions';
import { requestHeroesSave, requestSaveAll } from './PlatformActions';

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

export function _createHero(name: string, sex: 'm' | 'f', el: string): AsyncAction {
	return (dispatch, getState) => {
		const { currentHero: { past, present: { el: { startId }} }, herolist: { currentId }, locale: { messages }} = getState();
		if (typeof startId !== 'string' || typeof startId === 'string' && typeof currentId === 'string' && past.length === 0) {
			dispatch({
				type: ActionTypes.CREATE_HERO,
				payload: {
					name,
					sex,
					el
				}
			} as CreateHeroAction);
		}
		else if (messages) {
			confirm(_translate(messages, 'heroes.warnings.unsavedactions.text'), getTheme(getState()), messages, _translate(messages, 'heroes.warnings.unsavedactions.title'), true).then(result => {
				if (result === true) {
					dispatch({
						type: ActionTypes.CREATE_HERO,
						payload: {
							name,
							sex,
							el
						}
					} as CreateHeroAction);
				}
				else {
					dispatch(_setSection('hero'));
				}
			});
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
		else if (id && messages) {
			confirm(_translate(messages, 'heroes.warnings.unsavedactions.text'), getTheme(getState()), messages, _translate(messages, 'heroes.warnings.unsavedactions.title'), true).then(result => {
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

export function saveHeroes(): AsyncAction {
	return (dispatch, getState) => {
		const messages = getMessages(getState());
		if (messages) {
			dispatch(requestSaveAll());
			alert(_translate(messages, 'fileapi.allsaved'), getTheme(getState()));
		}
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
		dispatch(saveHeroes());
	};
}

export function exportHeroValidate(id: string, locale: UIMessages): AsyncAction {
	return dispatch => {
		dispatch(requestHeroExport(id, locale));
	};
}

export function deleteHeroValidate(id: string | undefined): AsyncAction {
	return (dispatch, getState) => {
		const { herolist: { heroes }, locale: { messages } } = getState();
		const hero = id && heroes.get(id);
		if (id && hero && messages) {
			confirm(_translate(messages, 'heroes.warnings.delete.message'), getTheme(getState()), messages, _translate(messages, 'heroes.warnings.delete.title', hero.name), true).then(result => {
				if (result === true) {
					dispatch(_deleteHero(id));
					dispatch(requestHeroesSave());
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
