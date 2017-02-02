import { CREATE_HERO, RECEIVE_HEROLIST, SET_HEROLIST_SORT_ORDER, SET_HEROLIST_VISIBILITY_FILTER } from '../constants/ActionTypes';
import AppDispatcher from '../dispatcher/AppDispatcher';
import WebAPIUtils from '../utils/WebAPIUtils';

export const request = () => WebAPIUtils.getHeroes();

export const setHerolistSortOrder = (sortOrder: string): void => AppDispatcher.dispatch(<SetHerolistSortOrderAction>{
	type: SET_HEROLIST_SORT_ORDER,
	payload: {
		sortOrder
	}
});

export const setHerolistVisibilityFilter = (filterOption: string): void => AppDispatcher.dispatch(<SetHerolistVisibilityFilterAction>{
	type: SET_HEROLIST_VISIBILITY_FILTER,
	payload: {
		filterOption
	}
});

export const receiveHerolist = (heroes: RawHerolist): void => AppDispatcher.dispatch(<ReceiveHerolistAction>{
	type: RECEIVE_HEROLIST,
	payload: {
		heroes
	}
});

export const createHero = (name: string, sex: 'm' | 'f', el: string): void => AppDispatcher.dispatch(<CreateHeroAction>{
	type: CREATE_HERO,
	payload: {
		name,
		sex,
		el
	}
});
