import * as ActionTypes from '../constants/ActionTypes';
import { store } from '../stores/AppStore';
import { Hero } from '../types/data.d';
import { alert } from '../utils/alert';
import { saveAll } from '../utils/FileAPIUtils';
import { generateHeroSaveData } from '../utils/generateHeroSaveData';
import { translate } from '../utils/I18n';
import { getNewIdByDate } from '../utils/IDUtils';
// import * as WebAPIUtils from '../utils/WebAPIUtils';

// export interface RequestHerolistAction {
// 	type: ActionTypes.REQUEST_HEROLIST;
// }

// export const requestList = () => {
// 	WebAPIUtils.getHeroes();
// 	AppDispatcher.dispatch<RequestHerolistAction>({
// 		type: ActionTypes.REQUEST_HEROLIST
// 	});
// };

export interface SetHerolistSortOrderAction {
	type: ActionTypes.SET_HEROLIST_SORT_ORDER;
	payload: {
		sortOrder: string;
	};
}

export const setSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetHerolistSortOrderAction>({
	type: ActionTypes.SET_HEROLIST_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export function _setSortOrder(sortOrder: string): SetHerolistSortOrderAction {
	return{
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

export const setVisibilityFilter = (filterOption: string) => AppDispatcher.dispatch<SetHerolistVisibilityFilterAction>({
	type: ActionTypes.SET_HEROLIST_VISIBILITY_FILTER,
	payload: {
		filterOption
	}
});

export function _setVisibilityFilter(filterOption: string): SetHerolistVisibilityFilterAction {
	return{
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

export const createHero = (name: string, sex: 'm' | 'f', el: string) => AppDispatcher.dispatch<CreateHeroAction>({
	type: ActionTypes.CREATE_HERO,
	payload: {
		name,
		sex,
		el
	}
});

export function _createHero(name: string, sex: 'm' | 'f', el: string): CreateHeroAction {
	return{
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

export const loadHero = (id: string) => {
	const data = store.getState().herolist.heroes.get(id);
	if (data) {
		AppDispatcher.dispatch<LoadHeroAction>({
			type: ActionTypes.LOAD_HERO,
			payload: {
				data
			}
		});
	}
};

export function _loadHero(id: string): LoadHeroAction | undefined {
	const data = store.getState().herolist.heroes.get(id);
	if (data) {
		return {
			type: ActionTypes.LOAD_HERO,
			payload: {
				data
			}
		};
	}
	return;
}

export const save = () => {
	saveAll();
	alert(translate('fileapi.allsaved'));
};

export interface SaveHeroAction {
	type: ActionTypes.SAVE_HERO;
	payload: {
		data: Hero;
	};
}

export const saveHero = () => {
	const data = generateHeroSaveData(store.getState());
	AppDispatcher.dispatch<SaveHeroAction>({
		type: ActionTypes.SAVE_HERO,
		payload: {
			data
		}
	});
};

export function _saveHero(): SaveHeroAction {
	const { id, dateCreated, dateModified, ...other } = generateHeroSaveData(store.getState());
	const data = {
		...other,
		id: id || `H_${getNewIdByDate()}`,
		dateCreated: dateCreated || new Date(),
		dateModified: new Date()
	};
	return {
		type: ActionTypes.SAVE_HERO,
		payload: {
			data
		}
	};
}

export interface DeleteHeroAction {
	type: ActionTypes.DELETE_HERO;
	payload: {
		id: string;
	};
}

export const deleteHero = (id: string) => {
	AppDispatcher.dispatch<DeleteHeroAction>({
		type: ActionTypes.DELETE_HERO,
		payload: {
			id
		}
	});
};

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

export const duplicateHero = (id: string) => {
	AppDispatcher.dispatch<DuplicateHeroAction>({
		type: ActionTypes.DUPLICATE_HERO,
		payload: {
			id
		}
	});
};

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

// export interface RequestHeroSaveAction {
// 	type: ActionTypes.REQUEST_HERO_SAVE;
// }

// export interface ReceiveHeroSaveAction {
// 	type: ActionTypes.RECEIVE_HERO_SAVE;
// }

// export const requestHeroSave = () => {
// 	AppDispatcher.dispatch<RequestHeroSaveAction>({
// 		type: ActionTypes.REQUEST_HERO_SAVE
// 	});
// 	WebAPIUtils.saveHero(generateHeroSaveData());
// };
