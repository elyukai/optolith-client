import * as ActionTypes from '../constants/ActionTypes';
import { Action, AppDispatcher } from '../dispatcher/AppDispatcher';
import { HerolistStore } from '../stores/HerolistStore';
import { Hero, HeroForSave } from '../types/data.d';
import { saveAll } from '../utils/FileAPIUtils';
import { generateHeroSaveData } from '../utils/generateHeroSaveData';
import { translate } from '../utils/I18n';
// import * as WebAPIUtils from '../utils/WebAPIUtils';

// export interface RequestHerolistAction extends Action {
// 	type: ActionTypes.REQUEST_HEROLIST;
// }

// export const requestList = () => {
// 	WebAPIUtils.getHeroes();
// 	AppDispatcher.dispatch<RequestHerolistAction>({
// 		type: ActionTypes.REQUEST_HEROLIST
// 	});
// };

export interface SetHerolistSortOrderAction extends Action {
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

export interface SetHerolistVisibilityFilterAction extends Action {
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

export interface CreateHeroAction extends Action {
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

export interface LoadHeroAction extends Action {
	type: ActionTypes.LOAD_HERO;
	payload: {
		data: Hero;
	};
}

export const loadHero = (id: string) => {
	const data = HerolistStore.get(id);
	if (data) {
		AppDispatcher.dispatch<LoadHeroAction>({
			type: ActionTypes.LOAD_HERO,
			payload: {
				data
			}
		});
	}
};

export const save = () => {
	saveAll();
	alert(translate('fileapi.allsaved'));
};

export interface SaveHeroAction extends Action {
	type: ActionTypes.SAVE_HERO;
	payload: {
		data: HeroForSave;
	};
}

export const saveHero = () => {
	const data = generateHeroSaveData();
	AppDispatcher.dispatch<SaveHeroAction>({
		type: ActionTypes.SAVE_HERO,
		payload: {
			data
		}
	});
};

export interface DeleteHeroAction extends Action {
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

export interface DuplicateHeroAction extends Action {
	type: ActionTypes.DUPLICATE_HERO;
	payload: {
		id: string;
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

// export interface RequestHeroSaveAction extends Action {
// 	type: ActionTypes.REQUEST_HERO_SAVE;
// }

// export interface ReceiveHeroSaveAction extends Action {
// 	type: ActionTypes.RECEIVE_HERO_SAVE;
// }

// export const requestHeroSave = () => {
// 	AppDispatcher.dispatch<RequestHeroSaveAction>({
// 		type: ActionTypes.REQUEST_HERO_SAVE
// 	});
// 	WebAPIUtils.saveHero(generateHeroSaveData());
// };
