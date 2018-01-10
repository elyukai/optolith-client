import * as ActionTypes from '../constants/ActionTypes';
import { getAdventurePointsSpent } from '../selectors/adventurePointsSelectors';
import { getMessages } from '../selectors/localeSelectors';
import { getCurrentHeroId, getCurrentHeroPast, getExperienceLevelStartId, getHeroes, getLocaleMessages, getTotalAdventurePoints } from '../selectors/stateSelectors';
import { AsyncAction } from '../types/actions.d';
import { Hero } from '../types/data.d';
import { generateHeroSaveData } from '../utils/generateHeroSaveData';
import { _translate } from '../utils/I18n';
import { getNewIdByDate } from '../utils/IDUtils';
import { addAlert } from './AlertActions';
import { requestHeroesSave, requestHeroExport, requestSaveAll } from './IOActions';
import { _setTab } from './LocationActions';

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
		enableAllRuleBooks: boolean;
		enabledRuleBooks: Set<string>;
	};
}

export function _createHero(name: string, sex: 'm' | 'f', el: string, enableAllRuleBooks: boolean, enabledRuleBooks: Set<string>): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const past = getCurrentHeroPast(state);
		const startId = getExperienceLevelStartId(state);
		const currentId = getCurrentHeroId(state);
		const messages = getLocaleMessages(state);
		if (typeof startId !== 'string' || typeof startId === 'string' && typeof currentId === 'string' && past.length === 0) {
			dispatch<CreateHeroAction>({
				type: ActionTypes.CREATE_HERO,
				payload: {
					name,
					sex,
					el,
					enableAllRuleBooks,
					enabledRuleBooks,
				}
			});
		}
		else if (messages) {
			dispatch(addAlert({
				title: _translate(messages, 'heroes.warnings.unsavedactions.title'),
				message: _translate(messages, 'heroes.warnings.unsavedactions.text'),
				confirm: {
					resolve: {
						type: ActionTypes.CREATE_HERO,
						payload: {
							name,
							sex,
							el,
							enableAllRuleBooks,
							enabledRuleBooks,
						}
					} as CreateHeroAction,
					reject: _setTab('profile')
				},
				confirmYesNo: true
			}));
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
		const data = getHeroes(getState()).get(id);
		if (data) {
			dispatch<LoadHeroAction>({
				type: ActionTypes.LOAD_HERO,
				payload: {
					data
				}
			});
		}
		return;
	};
}

export function loadHeroValidate(id: string): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const past = getCurrentHeroPast(state);
		const startId = getExperienceLevelStartId(state);
		const messages = getLocaleMessages(state);
		if (id && (past.length === 0 || !startId)) {
			const action = _loadHero(id);
			if (action) {
				dispatch(action);
			}
		}
		else if (id && messages) {
			// @ts-ignore
			dispatch(addAlert({
				title: _translate(messages, 'heroes.warnings.unsavedactions.title'),
				message: _translate(messages, 'heroes.warnings.unsavedactions.text'),
				confirm: {
					resolve: _loadHero(id),
					reject: _setTab('profile')
				},
				confirmYesNo: true
			}));
		}
	};
}

export function saveHeroes(): AsyncAction {
	return (dispatch, getState) => {
		const messages = getMessages(getState());
		if (messages) {
			dispatch(requestSaveAll());
			dispatch(addAlert({
				message: _translate(messages, 'fileapi.allsaved')
			}));
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
		const data: Hero = {
			...other,
			id,
			dateCreated,
			dateModified: new Date(),
			ap: {
				total: getTotalAdventurePoints(getState()),
				spent: getAdventurePointsSpent(getState())
			}
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

export function exportHeroValidate(id: string): AsyncAction {
	return dispatch => {
		dispatch(requestHeroExport(id));
	};
}

export function deleteHeroValidate(id: string | undefined): AsyncAction {
	return (dispatch, getState) => {
		const state = getState();
		const heroes = getHeroes(state);
		const messages = getLocaleMessages(state);
		const hero = id && heroes.get(id);
		if (id && hero && messages) {
			// @ts-ignore
			dispatch(addAlert({
				title: _translate(messages, 'heroes.warnings.delete.title', hero.name),
				message: _translate(messages, 'heroes.warnings.delete.message'),
				confirm: {
					resolve: (dispatch => {
						dispatch(_deleteHero(id));
						dispatch(requestHeroesSave());
					}) as AsyncAction
				},
				confirmYesNo: true
			}));
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
