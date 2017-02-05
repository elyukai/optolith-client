import { REQUEST_HEROLIST, CREATE_HERO, SET_HEROLIST_SORT_ORDER, SET_HEROLIST_VISIBILITY_FILTER, REQUEST_HERO_DATA } from '../constants/ActionTypes';
import * as WebAPIUtils from '../utils/WebAPIUtils';
import AppDispatcher from '../dispatcher/AppDispatcher';

export const requestList = () => {
	WebAPIUtils.getHeroes();
	AppDispatcher.dispatch<RequestHerolistAction>({
		type: REQUEST_HEROLIST
	});
};

export const setSortOrder = (sortOrder: string) => AppDispatcher.dispatch<SetHerolistSortOrderAction>({
	type: SET_HEROLIST_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export const setVisibilityFilter = (filterOption: string) => AppDispatcher.dispatch<SetHerolistVisibilityFilterAction>({
	type: SET_HEROLIST_VISIBILITY_FILTER,
	payload: {
		filterOption
	}
});

export const requestHero = (id: string) => {
	AppDispatcher.dispatch<RequestHeroDataAction>({
		type: REQUEST_HERO_DATA
	});
	WebAPIUtils.requestHero(id);
};

export const createHero = (name: string, sex: 'm' | 'f', el: string) => AppDispatcher.dispatch<CreateHeroAction>({
	type: CREATE_HERO,
	payload: {
		name,
		sex,
		el
	}
});
