import * as ActionTypes from '../constants/ActionTypes';
import { getMessages } from '../selectors/localeSelectors';
import { AsyncAction } from '../types/actions.d';
import { Hero } from '../types/data.d';
import { generateHeroSaveData } from '../utils/generateHeroSaveData';
import { _translate } from '../utils/I18n';
import { getNewIdByDate } from '../utils/IDUtils';
import { addAlert } from './AlertActions';
import { requestHeroesSave, requestHeroExport, requestSaveAll } from './IOActions';
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
			dispatch(addAlert({
				title: _translate(messages, 'heroes.warnings.unsavedactions.title'),
				message: _translate(messages, 'heroes.warnings.unsavedactions.text'),
				confirm: [
					{
						type: ActionTypes.CREATE_HERO,
						payload: {
							name,
							sex,
							el
						}
					} as CreateHeroAction,
					_setSection('hero')
				],
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
			dispatch(addAlert({
				title: _translate(messages, 'heroes.warnings.unsavedactions.title'),
				message: _translate(messages, 'heroes.warnings.unsavedactions.text'),
				confirm: [
					_loadHero(id) as any,
					_setSection('hero')
				],
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

export function exportHeroValidate(id: string): AsyncAction {
	return dispatch => {
		dispatch(requestHeroExport(id));
	};
}

export function deleteHeroValidate(id: string | undefined): AsyncAction {
	return (dispatch, getState) => {
		const { herolist: { heroes }, locale: { messages } } = getState();
		const hero = id && heroes.get(id);
		if (id && hero && messages) {
			dispatch(addAlert({
				title: _translate(messages, 'heroes.warnings.delete.title', hero.name),
				message: _translate(messages, 'heroes.warnings.delete.message'),
				confirm: [
					((dispatch: any) => {
						dispatch(_deleteHero(id));
						dispatch(requestHeroesSave());
					}) as any,
					undefined
				],
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
